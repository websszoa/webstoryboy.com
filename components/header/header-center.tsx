import Link from "next/link";

export default function HeaderCenter() {
  return (
    <h1 className="md:my-2 my-1 bg-background md:px-4 px-2">
      <Link
        href={"/"}
        aria-label="Webstoryboy 홈으로 이동"
        className="flex items-center md:text-8xl sm:text-7xl text-6xl font-poppins uppercase font-black"
      >
        <span className="inline-block ">st</span>
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-12! h-12! sm:w-16! sm:h-16! md:w-20! md:h-20! fill-red-500 dark:fill-yellow-400"
        >
          <path d="M150 0C232.843 0 300 67.1573 300 150C300 232.843 232.843 300 150 300C67.1573 300 0 232.843 0 150C0 67.1573 67.1573 0 150 0ZM125.916 115.663H46.3594L110.722 162.425L86.1377 238.087L150.5 191.325L214.862 238.087L190.278 162.425L254.641 115.663H175.084L150.5 40L125.916 115.663Z" />
        </svg>
        <span className="mr-[-0.5vw] inline-block">ry</span>
      </Link>
    </h1>
  );
}
