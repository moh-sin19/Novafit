package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.WorkoutSession;
import com.example.demo.model.SessionExercise;
import com.example.demo.model.SessionSet;
import com.example.demo.model.Exercise;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkoutSessionRepository;
import com.example.demo.repository.SessionExerciseRepository;
import com.example.demo.repository.SessionSetRepository;
import com.example.demo.repository.ExerciseRepository;
import com.example.demo.web.dto.CreateWorkoutRequest;
import com.example.demo.web.dto.WorkoutResponse;
import com.example.demo.web.dto.AddExerciseToWorkoutRequest;
import com.example.demo.web.dto.LogSetRequest;
import com.example.demo.web.dto.SessionExerciseResponse;
import com.example.demo.web.dto.SessionSetResponse;
import com.example.demo.web.dto.UpdateWorkoutRequest;
import com.example.demo.web.dto.UpdateSessionExerciseRequest;
import com.example.demo.web.dto.UpdateSessionSetRequest;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {
    
    private final WorkoutSessionRepository workoutSessionRepository;
    private final UserRepository userRepository;
    private final SessionExerciseRepository sessionExerciseRepository;
    private final SessionSetRepository sessionSetRepository;
    private final ExerciseRepository exerciseRepository;
    public WorkoutService(
        WorkoutSessionRepository workoutSessionRepository,
        UserRepository userRepository,
        SessionExerciseRepository sessionExerciseRepository,
        SessionSetRepository sessionSetRepository,
        ExerciseRepository exerciseRepository
    ) {
        this.workoutSessionRepository = workoutSessionRepository;
        this.userRepository = userRepository;
        this.sessionExerciseRepository = sessionExerciseRepository;
        this.sessionSetRepository = sessionSetRepository;
        this.exerciseRepository = exerciseRepository;
    }
    
    public WorkoutResponse createWorkout(CreateWorkoutRequest request) {
        //Validate that the user exists
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
            
        //Create new workout session
        WorkoutSession session = new WorkoutSession();
        session.setUser(user);
        session.setDate(request.getDate());
        session.setNotes(request.getNotes());
        
        //Save to database
        WorkoutSession saved = workoutSessionRepository.save(session);
        
        //Convert to response and return
        return WorkoutResponse.from(saved);
    }
    
    @Transactional
    public WorkoutResponse getWorkout(Integer workoutId) {
        WorkoutSession session = workoutSessionRepository.findById(workoutId)
            .orElseThrow(() -> new EntityNotFoundException("Workout not found"));
        return WorkoutResponse.from(session);
    }
    
    @Transactional
    public List<WorkoutResponse> getUserWorkouts(Integer userId) {
        List<WorkoutSession> sessions = workoutSessionRepository.findByUserUserIdOrderByDateDesc(userId);
        return sessions.stream()
            .map(WorkoutResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public SessionExerciseResponse addExerciseToWorkout(Integer workoutId, AddExerciseToWorkoutRequest request){

        //workout exists validation
        WorkoutSession session = workoutSessionRepository.findById(workoutId).orElseThrow(() -> new EntityNotFoundException("Workout not found"));

        //Validate that the exercise exists
        Exercise exercise = exerciseRepository.findById(request.getExerciseId()).orElseThrow(() -> new EntityNotFoundException("Exercise not found"));

        Integer nextSortOrder = request.getSortOrder();
        if (nextSortOrder == null) {
            nextSortOrder = (int) sessionExerciseRepository.countBySessionSessionId(workoutId) + 1;
        }

        //Create new session exercise
        SessionExercise sessionExercise = new SessionExercise();
        sessionExercise.setSession(session);
        sessionExercise.setExercise(exercise);
        sessionExercise.setType(request.getType());
        sessionExercise.setSortOrder(nextSortOrder);
        sessionExercise.setNotes(request.getNotes());

        //Save to database
        SessionExercise saved = sessionExerciseRepository.save(sessionExercise);

        // Initialize lazy-loaded exercise relationship within transaction
        Hibernate.initialize(saved.getExercise());
        
        //Convert to response and return
        return SessionExerciseResponse.from(saved);
    }

    @Transactional
    public SessionSetResponse logSet(Integer sessionExerciseId, LogSetRequest request){

        //session exercise exists validation
        SessionExercise sessionExercise = sessionExerciseRepository.findById(sessionExerciseId).orElseThrow(() -> new EntityNotFoundException("Session exercise not found"));

        //Create new session set
        SessionSet sessionSet = new SessionSet();
        sessionSet.setSessionExercise(sessionExercise);
        Integer setOrder = request.getSetOrder();
        if (setOrder == null) {
            setOrder = (int) sessionSetRepository.countBySessionExerciseSessionExerciseId(sessionExerciseId) + 1;
        }
        sessionSet.setSetOrder(setOrder);
        sessionSet.setReps(request.getReps());
        sessionSet.setWeight(request.getWeight());
        sessionSet.setRpe(request.getRpe());
        sessionSet.setDurationMin(request.getDurationMin());
        sessionSet.setDistanceM(request.getDistanceM());
        sessionSet.setCaloriesBurned(request.getCaloriesBurned());

        //Save to database
        SessionSet saved = sessionSetRepository.save(sessionSet);

        //Convert to response and return
        return SessionSetResponse.from(saved);
    }

    @Transactional
    public List<SessionExerciseResponse> getWorkoutExercises(Integer workoutId){
        List<SessionExercise> sessionExercises = sessionExerciseRepository.findBySessionSessionIdOrderBySortOrder(workoutId);
        return sessionExercises.stream()
            .map(SessionExerciseResponse::from)
            .collect(Collectors.toList());
    }
    @Transactional
    public List<SessionSetResponse> getWorkoutExerciseSets(Integer sessionExerciseId){
        List<SessionSet> sessionSets = sessionSetRepository.findBySessionExerciseSessionExerciseIdOrderBySetOrder(sessionExerciseId);
        return sessionSets.stream()
            .map(SessionSetResponse::from)
            .collect(Collectors.toList());
    }

    public WorkoutResponse updateWorkout(Integer workoutId, UpdateWorkoutRequest request){

        //find the existing workout and throw an error if it doesn't exist
        WorkoutSession session = workoutSessionRepository.findById(workoutId).orElseThrow(() -> new EntityNotFoundException("Workout not found"));

        //metadata updates
        session.setDate(request.getDate());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setNotes(request.getNotes());


        // Handle exercises if provided
        if (request.getExercises() != null) {
            session.getExercises().clear();
            //exercise updates
            for(UpdateSessionExerciseRequest exerciseRequest : request.getExercises()){
                SessionExercise sessionExercise = new SessionExercise();
                sessionExercise.setSession(session);
                sessionExercise.setExercise(exerciseRepository.findById(exerciseRequest.getExerciseId()).orElseThrow(() -> new EntityNotFoundException("Exercise not found")));
                sessionExercise.setType(exerciseRequest.getType());
                sessionExercise.setSortOrder(exerciseRequest.getSortOrder());
                sessionExercise.setNotes(exerciseRequest.getNotes());

                // Handle sets if provided (new sets or existing sets)
                if (exerciseRequest.getSets() != null) {
                    for (UpdateSessionSetRequest setRequest : exerciseRequest.getSets()) {
                        SessionSet sessionSet = new SessionSet();
                        sessionSet.setSessionExercise(sessionExercise);
                        sessionSet.setSetOrder(setRequest.getSetOrder());
                        sessionSet.setReps(setRequest.getReps());
                        sessionSet.setWeight(setRequest.getWeight());
                        sessionSet.setRpe(setRequest.getRpe());
                        sessionSet.setDurationMin(setRequest.getDurationMin());
                        sessionSet.setDistanceM(setRequest.getDistanceM());
                        sessionSet.setCaloriesBurned(setRequest.getCaloriesBurned());
                        
                        sessionExercise.getSets().add(sessionSet);
                    }
                }
                
                session.getExercises().add(sessionExercise);
            }
        }

        //save the updated workout
        WorkoutSession saved = workoutSessionRepository.save(session);
        return WorkoutResponse.from(saved);
    }
    public void deleteWorkout(Integer workoutId){
        workoutSessionRepository.deleteById(workoutId);
    }

    @Transactional
    public SessionExerciseResponse getSessionExercise(Integer sessionExerciseId) {
        SessionExercise sessionExercise = sessionExerciseRepository.findById(sessionExerciseId)
            .orElseThrow(() -> new EntityNotFoundException("Session exercise not found"));
        
        // Initialize lazy-loaded exercise relationship
        Hibernate.initialize(sessionExercise.getExercise());
        
        return SessionExerciseResponse.from(sessionExercise);
    }

    @Transactional
    public SessionExerciseResponse updateSessionExercise(Integer sessionExerciseId, UpdateSessionExerciseRequest request) {
        SessionExercise sessionExercise = sessionExerciseRepository.findById(sessionExerciseId)
            .orElseThrow(() -> new EntityNotFoundException("Session exercise not found"));

        // Update notes if provided
        if (request.getNotes() != null) {
            sessionExercise.setNotes(request.getNotes());
        }
        
        // Update sort order if provided
        if (request.getSortOrder() != null) {
            sessionExercise.setSortOrder(request.getSortOrder());
        }

        // Handle sets update - clear existing and add new ones
        if (request.getSets() != null) {
            sessionExercise.getSets().clear();
            for (UpdateSessionSetRequest setRequest : request.getSets()) {
                SessionSet sessionSet = new SessionSet();
                sessionSet.setSessionExercise(sessionExercise);
                sessionSet.setSetOrder(setRequest.getSetOrder());
                sessionSet.setReps(setRequest.getReps());
                sessionSet.setWeight(setRequest.getWeight());
                sessionSet.setRpe(setRequest.getRpe());
                sessionSet.setDurationMin(setRequest.getDurationMin());
                sessionSet.setDistanceM(setRequest.getDistanceM());
                sessionSet.setCaloriesBurned(setRequest.getCaloriesBurned());
                sessionExercise.getSets().add(sessionSet);
            }
        }

        SessionExercise saved = sessionExerciseRepository.save(sessionExercise);
        
        // Initialize lazy-loaded exercise relationship
        Hibernate.initialize(saved.getExercise());
        
        return SessionExerciseResponse.from(saved);
    }

    @Transactional
    public void deleteSessionExercise(Integer sessionExerciseId) {
        SessionExercise sessionExercise = sessionExerciseRepository.findById(sessionExerciseId)
            .orElseThrow(() -> new EntityNotFoundException("Session exercise not found"));
        sessionExerciseRepository.delete(sessionExercise);
    }
}
