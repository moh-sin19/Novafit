import Logo from "../components/ui/Logo";

export default function AuthLayout({ children, title, description }) {
  return (
    <div className="min-h-screen h-screen grid grid-cols-1 lg:grid-cols-2 bg-base text-primary overflow-hidden">
      {/* Left panel (hidden on mobile) */}
      <aside className="hidden h-screen lg:flex flex-col justify-between bg-secondary p-14 bg-auth-bg bg-no-repeat bg-cover bg-left ">
        <Logo />
      </aside>

      {/* Right panel (form/content) */}
      <main className=" flex items-center justify-center p-5 sm:p-10 xl:p-14 overflow-scroll">
        <div className="w-full max-w-[560px] flex flex-col gap-8 sm:gap-10">
          <div className="flex lg:hidden">
            <Logo />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1.5 md:gap-3">
            <h2 className="text-primary">{title}</h2>
            <p className="p2 text-secondary">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
