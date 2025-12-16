package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.web.dto.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * Service handling food search, logging, summaries, favourites and recipes.
 */
@Service
public class NutritionService {

    private final FatSecretClient fat;
    private final FoodItemRepository foodItemRepo;
    private final FoodServingRepository servingRepo;
    private final FoodLogRepository logRepo;
    private final DailyTotalsRepository dailyTotalsRepo;
    private final UserRepository userRepo;
    private final ObjectMapper mapper;

    @PersistenceContext
    private EntityManager em;

    public NutritionService(FatSecretClient fat,
                            FoodItemRepository foodItemRepo,
                            FoodServingRepository servingRepo,
                            FoodLogRepository logRepo,
                            DailyTotalsRepository dailyTotalsRepo,
                            UserRepository userRepo,
                            ObjectMapper mapper) {
        this.fat = fat;
        this.foodItemRepo = foodItemRepo;
        this.servingRepo = servingRepo;
        this.logRepo = logRepo;
        this.userRepo = userRepo;
        this.dailyTotalsRepo = dailyTotalsRepo;
        this.mapper = mapper;
    }

    // ============================================================
    //  FOOD SEARCH (LOCAL + FATSECRET)
    // ============================================================

    public FoodSearchResponse search(FoodSearchRequest req) {
        int page = req.page == null ? 0 : req.page;
        int size = req.pageSize == null ? 20 : req.pageSize;

        // ---------- Local DB ----------
        var local = foodItemRepo.findTop20ByNameContainingIgnoreCaseOrderByNameAsc(req.query);
        var localItems = local.stream().map(fi -> {
            FoodSearchItem it = new FoodSearchItem();
            it.id = fi.getFoodId();
            it.externalId = fi.getExternalRef();
            it.name = fi.getName();
            it.brand = fi.getBrand();
            it.foodType = fi.getSource();
            it.foodUrl = fi.getDetailsUrl();
            it.description = fi.getBrand();
            return it;
        }).toList();

        // ---------- FatSecret ----------
        List<FoodSearchItem> apiItems = List.of();
        Integer apiTotal = null;
        try {
            Map<String, Object> api = fat.foodsSearch(req.query, page, size);
            Map<String, Object> foods = mapper.convertValue(api.getOrDefault("foods", Map.of()), new TypeReference<>() {});
            Object foodObj = foods.get("food");

            List<Map<String, Object>> list;
            if (foodObj instanceof List<?>) {
                list = mapper.convertValue(foodObj, new TypeReference<List<Map<String, Object>>>() {});
            } else if (foodObj != null) {
                list = List.of(mapper.convertValue(foodObj, new TypeReference<Map<String, Object>>() {}));
            } else list = List.of();

            apiItems = list.stream().map(f -> {
                FoodSearchItem it = new FoodSearchItem();
                it.externalId = String.valueOf(f.get("food_id"));
                it.name = (String) f.get("food_name");
                it.brand = (String) f.get("brand_name");
                it.foodType = (String) f.get("food_type");
                it.foodUrl = (String) f.get("food_url");
                it.description = (String) f.get("food_description");
                return it;
            }).toList();

            Object totalObj = foods.get("total_results");
            if (totalObj != null) apiTotal = Integer.parseInt(totalObj.toString());
        } catch (Exception ignored) {}

        var combined = new ArrayList<FoodSearchItem>();
        combined.addAll(localItems);
        combined.addAll(apiItems);

        FoodSearchResponse res = new FoodSearchResponse();
        res.page = page;
        res.pageSize = size;
        res.total = (apiTotal != null ? apiTotal : apiItems.size()) + localItems.size();
        res.items = combined;
        return res;
    }

    // ============================================================
    //  ADD FOOD LOG
    // ============================================================

    @Transactional
    public AddFoodLogResponse addFoodLog(long userId, AddFoodLogRequest req) {
        User user = userRepo.findById((int) userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (req.servingQty == null || req.servingQty <= 0)
            throw new IllegalArgumentException("servingQty must be > 0");

        // --- Determine or create FoodItem ---
        FoodItem item;
        if (req.externalId != null && !req.externalId.isBlank()) {
            // ensures FoodItem + FoodServing upserted from FatSecret
            item = upsertApiFood(req.externalId);
        } else if (req.foodId != null) {
            item = foodItemRepo.findById(req.foodId)
                    .orElseThrow(() -> new IllegalArgumentException("Food not found: " + req.foodId));
        } else {
            // CUSTOM: create FoodItem + one FoodServing using *per-serving* macros
            if (req.name == null || req.name.isBlank())
                throw new IllegalArgumentException("name is required for custom food");
            if (req.servingType == null || req.servingType.isBlank())
                throw new IllegalArgumentException("servingType is required for custom food");
            if (req.kcalPerServing == null || req.proteinPerServing == null ||
                req.carbsPerServing == null || req.fatPerServing == null)
                throw new IllegalArgumentException("per-serving macros are required for custom food");

            item = new FoodItem();
            item.setSource("CUSTOM");
            item.setCreatedBy(user);
            item.setName(req.name);
            item.setBrand(req.brand != null && !req.brand.isBlank() ? req.brand : "Generic");
            item.setDetailsUrl(null);
            item = foodItemRepo.save(item);

            FoodServing s = new FoodServing();
            s.setFood(item);
            s.setLabel(req.servingType);     // e.g., "1 cup", "1 medium"
            s.setUnits(1.0);                 // one unit of that label
            s.setMetricQty(null);            // unknown unless user provides
            s.setMetricUnit(null);
            s.setKcal(req.kcalPerServing);
            s.setProteinG(req.proteinPerServing);
            s.setCarbsG(req.carbsPerServing);
            s.setFatG(req.fatPerServing);
            servingRepo.save(s);
        }

        // --- Determine serving (prefer id, fall back to label) ---
        FoodServing serving = null;
        if (req.servingId != null) {
            serving = servingRepo.findById(req.servingId)
                    .orElseThrow(() -> new IllegalArgumentException("Serving not found: " + req.servingId));
            if (!serving.getFood().getFoodId().equals(item.getFoodId()))
                throw new IllegalArgumentException("Serving does not belong to selected food");
        } else if (req.servingType != null && !req.servingType.isBlank()) {
            serving = servingRepo.findByFoodAndLabel(item, req.servingType).orElse(null);
        }
        if (serving == null)
            throw new IllegalArgumentException("Invalid serving selection");

        // --- Compute snapshots from serving * qty (per-serving macros × qty) ---
        double qty = req.servingQty;
        double kcal = round(nz(serving.getKcal()) * qty);
        double p    = round(nz(serving.getProteinG()) * qty);
        double c    = round(nz(serving.getCarbsG()) * qty);
        double f    = round(nz(serving.getFatG()) * qty);

        FoodLog log = new FoodLog();
        log.setUser(user);
        log.setFood(item);
        log.setServing(serving);
        log.setServingType(serving.getLabel());
        log.setServingQty(qty);
        log.setMealType(req.mealType);
        log.setLogDate(LocalDate.parse(req.logDate));
        log.setKcalSnapshot(kcal);
        log.setProteinGSnapshot(p);
        log.setCarbsGSnapshot(c);
        log.setFatGSnapshot(f);
        log.setNote(req.note);
        em.persist(log);

        dailyTotalsUpsert(userId, log.getLogDate(), kcal, p, c, f);
        return new AddFoodLogResponse(log.getLogId(), item.getFoodId());
    }


    // ============================================================
    //  UPDATE FOOD LOG
    // ============================================================

    @Transactional
    public void updateFoodLog(int userId, int logId, UpdateFoodLogRequest req) {
        FoodLog log = logRepo.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Log not found"));
        if (!log.getUser().getUserId().equals(userId))
            throw new IllegalArgumentException("Log not owned by user");

        double oldK = log.getKcalSnapshot();
        double oldP = log.getProteinGSnapshot();
        double oldC = log.getCarbsGSnapshot();
        double oldF = log.getFatGSnapshot();

        // Change serving by ID first (preferred)
        if (req.servingId != null) {
            FoodServing newServing = servingRepo.findById(req.servingId)
                    .orElseThrow(() -> new IllegalArgumentException("Serving not found: " + req.servingId));
            if (!newServing.getFood().getFoodId().equals(log.getFood().getFoodId()))
                throw new IllegalArgumentException("Serving does not belong to this food");
            log.setServing(newServing);
            log.setServingType(newServing.getLabel()); // keep snapshot label in sync
        } else if (req.servingType != null) { // fallback by label
            FoodServing newServing = servingRepo.findByFoodAndLabel(log.getFood(), req.servingType)
                    .orElseThrow(() -> new IllegalArgumentException("Serving label not found for this food"));
            log.setServing(newServing);
            log.setServingType(newServing.getLabel());
        }

        if (req.servingQty != null) log.setServingQty(req.servingQty);

        FoodServing s = log.getServing();
        double qty = log.getServingQty();
        log.setKcalSnapshot(round(nz(s.getKcal()) * qty));
        log.setProteinGSnapshot(round(nz(s.getProteinG()) * qty));
        log.setCarbsGSnapshot(round(nz(s.getCarbsG()) * qty));
        log.setFatGSnapshot(round(nz(s.getFatG()) * qty));

        if (req.mealType != null) log.setMealType(Enum.valueOf(MealType.class, req.mealType));
        if (req.note != null) log.setNote(req.note);

        em.merge(log);

        dailyTotalsUpsert(
            userId, log.getLogDate(),
            log.getKcalSnapshot() - oldK,
            log.getProteinGSnapshot() - oldP,
            log.getCarbsGSnapshot() - oldC,
            log.getFatGSnapshot() - oldF
        );
    }

    // ============================================================
    //  FAVOURITES
    // ============================================================

    @Transactional
    public void addFavourite(int userId, int foodId) {
        em.createNativeQuery("""
            INSERT INTO user_favourite_food(user_id, food_id)
            VALUES(:u,:f)
            ON CONFLICT(user_id,food_id) DO NOTHING
        """).setParameter("u", userId).setParameter("f", foodId).executeUpdate();
    }

    @Transactional
    public void removeFavourite(int userId, int foodId) {
        em.createNativeQuery("""
            DELETE FROM user_favourite_food WHERE user_id=:u AND food_id=:f
        """).setParameter("u", userId).setParameter("f", foodId).executeUpdate();
    }

    @SuppressWarnings("unchecked")
    public List<FavouriteFoodResponse> listFavourites(int userId) {
        String sql = """
            SELECT fi.food_id, fi.name, fi.brand, fi.details_url
            FROM user_favourite_food uf
            LEFT JOIN food_item fi ON fi.food_id = uf.food_id
            WHERE uf.user_id=:u
            ORDER BY uf.created_at DESC
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("u", userId)
                .getResultList();

        List<FavouriteFoodResponse> result = new ArrayList<>();
        for (Object[] r : rows) {
            FavouriteFoodResponse dto = new FavouriteFoodResponse();
            dto.foodId = ((Number) r[0]).intValue();
            dto.name = (String) r[1];
            dto.brand = (String) r[2];
            dto.detailsUrl = (String) r[3];
            result.add(dto);
        }
        return result;
    }

    // ============================================================
    //  SUMMARIES
    // ============================================================

    public Map<String, Object> daySummary(int userId, String dateIso) {
        String sql = """
            SELECT IFNULL(SUM(kcal_snapshot),0),
                   IFNULL(SUM(protein_g_snapshot),0),
                   IFNULL(SUM(carbs_g_snapshot),0),
                   IFNULL(SUM(fat_g_snapshot),0)
            FROM food_log WHERE user_id=:u AND log_date=:d
        """;
        Object[] row = (Object[]) em.createNativeQuery(sql)
                .setParameter("u", userId)
                .setParameter("d", dateIso)
                .getSingleResult();

        return Map.of(
                "date", dateIso,
                "kcal", round(((Number) row[0]).doubleValue()),
                "protein_g", round(((Number) row[1]).doubleValue()),
                "carbs_g", round(((Number) row[2]).doubleValue()),
                "fat_g", round(((Number) row[3]).doubleValue())
        );
    }

    // ============================================================
    //  HELPERS
    // ============================================================

    private FoodItem upsertApiFood(String externalId) {
        Map<String, Object> raw = fat.foodGet(externalId);
        Map<String, Object> food = mapper.convertValue(raw.get("food"), new TypeReference<>() {});

        String name = (String) food.get("food_name");
        String foodType = (String) food.get("food_type");
        String brandName = (String) food.get("brand_name");
        String url = (String) food.get("food_url");

        // determine brand
        String brand = "Generic";
        if ("Brand".equalsIgnoreCase(foodType)) {
            brand = (brandName == null || brandName.isBlank()) ? "Brand" : brandName;
        }

        // ---------- find or create FoodItem ----------
        FoodItem existing = foodItemRepo.findBySourceAndExternalRef("API", externalId).orElse(null);
        FoodItem item;
        if (existing != null) {
            item = existing;
        } else {
            item = new FoodItem();
            item.setSource("API");
            item.setExternalRef(externalId);
        }

        // update if anything changed
        boolean changed = false;
        changed |= setIfDiff(item::getName, item::setName, name);
        changed |= setIfDiff(item::getBrand, item::setBrand, brand);
        changed |= setIfDiff(item::getDetailsUrl, item::setDetailsUrl, url);
        if (changed) item = foodItemRepo.save(item);

        // ---------- upsert servings ----------
        Map<String, Object> servingsObj =
                mapper.convertValue(food.getOrDefault("servings", Map.of()), new TypeReference<>() {});
        Object sObj = servingsObj.get("serving");

        List<Map<String, Object>> servings;
        if (sObj instanceof List<?>) {
            servings = mapper.convertValue(sObj, new TypeReference<>() {});
        } else if (sObj != null) {
            servings = List.of(mapper.convertValue(sObj, new TypeReference<Map<String, Object>>() {}));
        } else {
            servings = List.of();
        }

        for (Map<String, Object> s : servings) {
            String sid = s.get("serving_id") != null ? String.valueOf(s.get("serving_id")) : null;
            String label = (String) s.get("serving_description");
            double kcal = parseD(s.get("calories"), 0);
            double p = parseD(s.get("protein"), 0);
            double c = parseD(s.get("carbohydrate"), 0);
            double f = parseD(s.get("fat"), 0);
            double qty = parseD(s.get("metric_serving_amount"), 100);
            String unit = optS(s.get("metric_serving_unit"), "g");

            FoodServing fs = servingRepo.findByFoodAndExternalServingId(item, sid).orElse(null);
            if (fs == null) {
                fs = new FoodServing();
                fs.setFood(item);
                fs.setExternalServingId(sid);
                fs.setLabel(label);
            }

            fs.setUnits(1.0);
            fs.setMetricQty(qty);
            fs.setMetricUnit(unit);
            fs.setKcal(kcal);
            fs.setProteinG(p);
            fs.setCarbsG(c);
            fs.setFatG(f);
            servingRepo.save(fs);
        }

        return item;
    }

    // Utility methods
    private static String optS(Object o, String def) { return o == null ? def : o.toString(); }
    private static double parseD(Object o, double def) {
        try { return o == null ? def : Double.parseDouble(o.toString()); }
        catch (Exception e) { return def; }
    }
    private static double nz(Double v) { return v == null ? 0d : v; }
    private static double round(double v) { return Math.round(v * 100.0) / 100.0; }

    private static <T> boolean setIfDiff(java.util.function.Supplier<T> getter,
                                         java.util.function.Consumer<T> setter,
                                         T newVal) {
        T old = getter.get();
        if (Objects.equals(old, newVal)) return false;
        setter.accept(newVal);
        return true;
    }

    @Transactional
    private void dailyTotalsUpsert(long userId, LocalDate date,
                                   double deltaKcal, double deltaProtein,
                                   double deltaCarbs, double deltaFat) {
        em.createNativeQuery("""
            INSERT INTO daily_totals (user_id, date, kcal_total, protein_g_total, carbs_g_total, fat_g_total)
            VALUES (:u, :d, :k, :p, :c, :f)
            ON CONFLICT(user_id, date) DO UPDATE SET
                kcal_total = daily_totals.kcal_total + EXCLUDED.kcal_total,
                protein_g_total = daily_totals.protein_g_total + EXCLUDED.protein_g_total,
                carbs_g_total = daily_totals.carbs_g_total + EXCLUDED.carbs_g_total,
                fat_g_total = daily_totals.fat_g_total + EXCLUDED.fat_g_total
        """).setParameter("u", userId)
                // .setParameter("d", date)
                .setParameter("d", date.toString())
                .setParameter("k", deltaKcal)
                .setParameter("p", deltaProtein)
                .setParameter("c", deltaCarbs)
                .setParameter("f", deltaFat)
                .executeUpdate();
    }

    public FoodDetailResponse getFoodDetailById(int foodId) {
        var opt = foodItemRepo.findById(foodId);
        if (opt.isEmpty()) return null;
        var fi = opt.get();

        var servings = servingRepo.findByFood(fi);
        var servingDtos = servings.stream().map(s -> {
            ServingDTO d = new ServingDTO();
            d.servingId = s.getServingId();
            d.label = s.getLabel();
            d.units = s.getUnits();
            d.metricQty = s.getMetricQty();
            d.metricUnit = s.getMetricUnit();
            d.kcal = s.getKcal();
            d.proteinG = s.getProteinG();
            d.carbsG = s.getCarbsG();
            d.fatG = s.getFatG();
            return d;
        }).toList();

        FoodDetailResponse dto = new FoodDetailResponse();
        dto.foodId = fi.getFoodId();
        dto.source = fi.getSource();
        dto.externalRef = fi.getExternalRef();
        dto.name = fi.getName();
        dto.brand = fi.getBrand();
        dto.detailsUrl = fi.getDetailsUrl();
        dto.servings = servingDtos;
        return dto;
    }

    // Optional exposure so controller can reuse repository method already annotated with @EntityGraph
    public com.example.demo.repository.FoodLogRepository getLogRepo() {
        return this.logRepo;
    }

    public com.example.demo.repository.DailyTotalsRepository getDailyTotalsRepo() {
        return this.dailyTotalsRepo;
    }

    public Map<String, Object> fatsecretRawByExternalId(String externalId) {
        if (externalId == null || externalId.isBlank()) {
            return Map.of();
        }
        return fat.foodGet(externalId); // raw FatSecret payload (no mapping)
    }

    public List<RangeSummaryResponse> rangeSummary(int userId, String startIso, String endIso) {
        LocalDate start = LocalDate.parse(startIso);
        LocalDate end = LocalDate.parse(endIso);

        List<DailyTotals> totals =
                dailyTotalsRepo.findByUserIdAndDateBetweenOrderByDateAsc(userId, start, end);

        List<Object[]> logs = em.createQuery("""
            SELECT f.logDate, SUM(f.kcalSnapshot), SUM(f.proteinGSnapshot),
                SUM(f.carbsGSnapshot), SUM(f.fatGSnapshot)
            FROM FoodLog f
            WHERE f.user.userId = :userId
            AND f.logDate BETWEEN :start AND :end
            GROUP BY f.logDate
            ORDER BY f.logDate
        """, Object[].class)
        .setParameter("userId", userId)
        .setParameter("start", start)
        .setParameter("end", end)
        .getResultList();

        Map<LocalDate, DailyTotals> totalsMap = new HashMap<>();
        for (DailyTotals t : totals) totalsMap.put(t.getDate(), t);

        Map<LocalDate, double[]> logMap = new HashMap<>();
        for (Object[] row : logs) {
            LocalDate d = (LocalDate) row[0];
            logMap.put(d, new double[]{
                ((Number) row[1]).doubleValue(),
                ((Number) row[2]).doubleValue(),
                ((Number) row[3]).doubleValue(),
                ((Number) row[4]).doubleValue()
            });
        }

        List<RangeSummaryResponse> result = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            double kcal = 0, p = 0, c = 0, f = 0;
            DailyTotals t = totalsMap.get(date);
            if (t != null) {
                kcal = nz(t.getKcalTotal());
                p = nz(t.getProteinGTotal());
                c = nz(t.getCarbsGTotal());
                f = nz(t.getFatGTotal());
            } else if (logMap.containsKey(date)) {
                double[] vals = logMap.get(date);
                kcal = vals[0];
                p = vals[1];
                c = vals[2];
                f = vals[3];
            }

            RangeSummaryResponse dto = new RangeSummaryResponse();
            dto.date = date.toString();
            dto.kcal = round(kcal);
            dto.proteinG = round(p);
            dto.carbsG = round(c);
            dto.fatG = round(f);
            result.add(dto);
        }
        return result;
    }

    @Transactional
    public FoodDetailResponse findOrCreate(Integer id, String externalId) {
        boolean hasId = id != null;
        boolean hasExt = externalId != null && !externalId.isBlank();

        if (!hasId && !hasExt) {
            throw new IllegalArgumentException("Provide id or externalId");
        }

        // Both provided → ensure they refer to the same local record if both exist
        if (hasId && hasExt) {
            var byId  = foodItemRepo.findById(id).orElseThrow(NoSuchElementException::new);
            var byExt = foodItemRepo.findBySourceAndExternalRef("API", externalId).orElse(null);
            if (byExt != null && !Objects.equals(byId.getFoodId(), byExt.getFoodId())) {
                throw new IllegalArgumentException("Mismatched id and externalId");
            }
            return getFoodDetailById(byId.getFoodId());
        }

        // A / B: local id path
        if (hasId) {
            FoodDetailResponse dto = getFoodDetailById(id);
            if (dto == null) throw new NoSuchElementException();
            return dto;
        }

        // C: external-only → import if needed, then return details
        var existing = foodItemRepo.findBySourceAndExternalRef("API", externalId).orElse(null);
        if (existing == null) {
            var created = upsertApiFood(externalId); // does fetch + save + servings upsert
            return getFoodDetailById(created.getFoodId());
        } else {
            return getFoodDetailById(existing.getFoodId());
        }
    }

}
