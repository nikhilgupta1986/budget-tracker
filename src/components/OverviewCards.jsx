// src/components/OverviewCards.jsx

const OverviewCards = ({ income, expenses, savings }) => {
    const cardStyle = {
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "#f7f7f7",
      textAlign: "center",
      flex: "1",
      margin: "10px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    };
  
    return (
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h4>Income</h4>
          <p>₹{income}</p>
        </div>
        <div style={cardStyle}>
          <h4>Expenses</h4>
          <p>₹{expenses}</p>
        </div>
        <div style={cardStyle}>
          <h4>Savings</h4>
          <p>₹{savings}</p>
        </div>
      </div>
    );
  };
  
  export default OverviewCards;
  