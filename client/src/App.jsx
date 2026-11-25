import Header from "./components/Header"
const App = () => {
  return (
    
    <div className="p-10 space-y-4">
      <Header />
      <h1 className="font-display text-5xl font-bold">Clothes, food and everything else</h1>
      <p className="text-muted">Testing the Sunshine palette.</p>
      <button className="bg-orange text-navy font-semibold rounded-full h-13 px-7 hover:bg-orange-hover">
        Shop today's deals
      </button>
    </div>
  )
}


export default App
