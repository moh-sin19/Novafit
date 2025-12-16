export default function TitleCard({ title , lastUpdated}) {
    return <div className="flex flex-col justify-center items-start gap-[1vw] width-1 bg-secondary
    h-[6em] lg:h-[9em] px-[6vw] lg:px-[11vw]">
        <h3 className="pt-[0.5vw] text-[20px] lg:text-[28px]">{title}</h3>
        <div className="p3 text-secondary text-[12px] lg:text-[14px]">Last updated: {lastUpdated}</div>
    </div>;
}