// src/components/Menu.jsx
// Komponent Menu, z którego użytkownik wybiera, czy chce przejść do przepisów lub składników
const Menu = ({ onNavigate }) => {
    return (
      <div className="menu-container">
        <h1 className="main-title">Szef Kuchni</h1>
        <div className="menu-options">
          <button onClick={() => onNavigate("recipes")}>Przepisy</button>
          <button onClick={() => onNavigate("ingredients")}>Podaj dostępne składniki</button>
        </div>
        <div className="menu-image">
          <img
            src="https://images.immediate.co.uk/production/volatile/sites/49/2023/10/img8WKO9d-d28e9f6.jpg?quality=90&crop=0px,0px,1199px,799px&resize=980,654"
            alt="Grafika Szef Kuchni"
          />
        </div>
      </div>
    );
  };
  
  export default Menu;
  