import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      {/*Hidden at smaller sizes (standard footer)*/}
      <div className="hidden lg:flex w-full items-center justify-between mx-auto border-t border-subtle py-5 bg-base">
        <div className="p3 w-fit ml-[3%]">
          © 2025 Novafit. All rights reserved.
        </div>
        <div className=" flex flex-wrap min-w-[50%] items-center justify-end gap-[80px] text-right mr-[3%]">
          <Link to={"/privacy"} className="p2 whitespace-nowrap ">
            Privacy Policy
          </Link>
          <Link to={"/terms"} className="p2 w-fit whitespace-nowrap ">
            Terms & Conditions
          </Link>
        </div>
      </div>
      {/*Hidden at larger sizes (stacked footer)*/}
      <div className="flex lg:hidden flex-col w-full items-start justify-center gap-[10px] border-t border-subtle py-5 bg-base">
        <div className="flex flex-row items-center justify-start gap-[40px] text-left px-[6vw]">
          <Link
            to={"/privacy"}
            className="p2 whitespace-nowrap text-[14px] lg:text-[16px]"
          >
            Privacy Policy
          </Link>
          <Link
            to={"/terms"}
            className="p2 w-fit whitespace-nowrap text-[14px] lg:text-[16px]"
          >
            Terms & Conditions
          </Link>
        </div>
        <div className="p3 w-fit text-[12px] lg:text-[14px] px-[6vw]">
          © 2025 Novafit. All rights reserved.
        </div>
      </div>
    </div>
  );
}
