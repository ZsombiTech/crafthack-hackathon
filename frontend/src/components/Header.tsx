import LogoLogin from "../assets/images/logoLogin.svg";

interface HeaderProps {
  heading: string;
}

export default function Header({ heading }: HeaderProps) {
  return (
    <div className="mb-3">
      <img src={LogoLogin} alt="Logo" className="w-36 mx-auto" />
      <div className="w-3/4 mx-auto mt-2">
        <h2 className="font-semibold mt-6 text-center text-xl text-white">
          {heading}
        </h2>
      </div>
    </div>
  );
}
