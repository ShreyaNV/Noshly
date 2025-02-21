export default function Header() {
    return (
      <header className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Food Wastage App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Sellers</a></li>
              <li><a href="#" className="hover:underline">Consumers</a></li>
              <li><a href="#" className="hover:underline">Admin</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }