import React, { useState } from "react";

const SellEnergy = () => {
    const [units, setUnits] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const pricePerUnit = 7;

    const handleSell = () => {
        setTotalEarnings(units * pricePerUnit);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };
    const [user, setUser] = useState({ name: "Atharav Kewate", region: "Nagpur, Maharashtra", contractNo: "93626382639" });

    const styles = {
        container: {
            width: "50%",
            margin: "auto",
            marginTop: "100px",
            padding: "20px",
            textAlign: "center",
            background: "linear-gradient(to right, #121212, #1e3c72, #2a5298)",
            color: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
            animation: "fadeIn 1s ease-in-out"
        },
        title: {
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
            position: "relative",
            transition: "transform 0.3s ease-in-out"
        },
        titleHover: {
            transform: "scale(1.1)"
        },
        input: {
            padding: "10px",
            fontSize: "1rem",
            width: "80%",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            textAlign: "center"
        },
        button: {
            marginTop: "40px",
            padding: "10px 20px",
            fontSize: "1rem",
            border: "none",
            borderRadius: "5px",
            background: "#FF5733",
            color: "#fff",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out"
        },
        buttonHover: {
            transform: "scale(1.1)"
        },
        popup: {
            position: "fixed",
            marginTop: "75px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#222",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            animation: "popupFade 0.5s ease-in-out"
        },
        emoji: {
            fontSize: "1.5rem",
            marginLeft: "10px"
        }
    };

    return (
        <div style={styles.container}>
            <h2 
                style={styles.title} 
                onMouseEnter={(e) => e.currentTarget.style.transform = styles.titleHover.transform}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
                Sell Energy 🔋
            </h2>
                  {/* User Information */}
                  <p style={styles.userInfo}><strong>User :</strong> {user.name}</p>
            <p style={styles.userInfo}><strong>Consumer No :</strong> {user.contractNo}</p>
            <p style={styles.userInfo}><strong>Region :</strong> {user.region}</p>
            <input 
                type="number" 
                placeholder="Enter units" 
                value={units} 
                onChange={(e) => setUnits(e.target.value)} 
                style={styles.input}
            />
            <br />
            <button 
                onClick={handleSell} 
                style={styles.button} 
                onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
                Sell 🔋
            </button>
            <p>Total Earnings:  ₹{totalEarnings.toFixed(2)}</p>
            {showPopup && (
                <div style={styles.popup}>
                    <p>✅ You have successfully sold {units} units of energy for  ₹{totalEarnings.toFixed(2)}! 🔋</p>
                </div>
            )}
        </div>
    );
};

export default SellEnergy;
