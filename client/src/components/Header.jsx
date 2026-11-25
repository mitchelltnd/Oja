import Logo from './Logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1240px] items-center gap-7 px-4">
        <Logo className="text-[2rem]" />
      </div>
    </header>
  )
};
 export default Header; 