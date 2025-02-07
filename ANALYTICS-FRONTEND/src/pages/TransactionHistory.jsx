  import React from "react";

  const TransactionHistory = () => {
      const transactions = [
          { id: "#TXN001", date: "07-Feb-2025", amount: "+ $500.00", type: "Credit", status: "Completed", method: "Bank Transfer", recipient: "Atharva Kewate", location: "Pune" },
          { id: "#TXN002", date: "06-Feb-2025", amount: "- $200.00", type: "Debit", status: "Pending", method: "Credit Card", recipient: "Ekansh Mahajan", location: "Nagpur" },
          { id: "#TXN003", date: "05-Feb-2025", amount: "+ $150.00", type: "Credit", status: "Completed", method: "UPI", recipient: "Mike Ross", location: "Delhi" },
          { id: "#TXN004", date: "04-Feb-2025", amount: "- $300.00", type: "Debit", status: "Pending", method: "Credit Card", recipient: "John Doe", location: "New York" },
          { id: "#TXN005", date: "03-Feb-2025", amount: "+ $250.00", type: "Credit", status: "Completed", method: "Bank Transfer", recipient: "Jane Smith", location: "London" },
          { id: "#TXN006", date: "02-Feb-2025", amount: "- $100.00", type: "Debit", status: "Pending", method: "Credit Card", recipient: "Bob Johnson", location: "Paris" },
          { id: "#TXN007", date: "01-Feb-2025", amount: "+ $350.00", type: "Credit", status: "Completed", method: "UPI", recipient: "Sachin Tendulkar", location: "Delhi" },
          { id: "#TXN008", date: "31-Jan-2025", amount: "- $400.00", type: "Debit", status: "Pending", method: "Credit Card", recipient: "Rahul Dravid", location: "Mumbai" },
          { id: "#TXN009", date: "30-Jan-2025", amount: "+ $200.00", type: "Credit", status: "Completed", method: "Bank Transfer", recipient: "Virat Kohli", location: "Banglore" },
          { id: "#TXN010", date: "29-Jan-2025", amount: "+ $400.00", type: "Debit", status: "Completed", method: "UPI", recipient: "MS Dhoni", location: "Chennai" },
          
      ];

      const styles = {
          container: {
              width: "80%",
              margin: "auto",
              background: "white",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
              animation: "fadeIn 0.8s ease-in-out"
          },
          title: {
            fontSize: "2rem",
            fontWeight: "bold",
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
            transition: "color 0.3s ease-in-out"
        },
        titleHover: {
            color: "#333"
        },
        underline: {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "4px",
            bottom: "-5px",
            left: "0",
            background: "#00BFFF",
            transform: "scaleX(0)",
            transition: "transform 0.3s ease-in-out"
        },
        titleContainer: {
            display: "inline-block",
            position: "relative"
        },
          table: {
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px"
          },
          th: {
              padding: "12px",
              backgroundColor: "#333",
              color: "white",
              borderBottom: "4px solid #ddd"
          },
          td: {
              padding: "12px",
              borderBottom: "2px solid #ddd",
              textAlign: "center"
          },
          credit: { color: "green", fontWeight: "bold" },
          debit: { color: "red", fontWeight: "bold" },
          row: {
              transition: "0.3s",
              cursor: "pointer"
          },
          hoverRow: {
              transform: "scale(1.05)",
              backgroundColor: "#f1f1f1",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }
      };

      return (
          <div style={styles.container}>
              <div 
                style={styles.titleContainer} 
                onMouseEnter={(e) => e.currentTarget.firstChild.style.color = styles.titleHover.color}
                onMouseLeave={(e) => e.currentTarget.firstChild.style.color = "black"}
            >
                <h2 style={styles.title}>Transaction History</h2>
                <div 
                    style={styles.underline} 
                    className="underline-effect"
                ></div>
            </div>
              <table style={styles.table}>
                  <thead>
                      <tr>
                          <th style={styles.th}>Transaction ID</th>
                          <th style={styles.th}>Date</th>
                          <th style={styles.th}>Amount</th>
                          <th style={styles.th}>Type</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Payment Method</th>
                          <th style={styles.th}>Recipient</th>
                          <th style={styles.th}>Location</th>

                      </tr>
                  </thead>
                  <tbody>
                      {transactions.map((txn, index) => (
                          <tr key={index} 
                              style={styles.row} 
                              onMouseEnter={(e) => e.currentTarget.style = Object.entries(styles.hoverRow).map(([key, value]) => `${key}: ${value}`).join('; ')}
                              onMouseLeave={(e) => e.currentTarget.style = Object.entries(styles.row).map(([key, value]) => `${key}: ${value}`).join('; ')}>
                              <td style={styles.td}>{txn.id}</td>
                              <td style={styles.td}>{txn.date}</td>
                              <td style={txn.type === "Credit" ? styles.credit : styles.debit}>{txn.amount}</td>
                              <td style={styles.td}>{txn.type}</td>
                              <td style={styles.td}>{txn.status}</td>
                              <td style={styles.td}>{txn.method}</td>
                              <td style={styles.td}>{txn.recipient}</td>
                              <td style={styles.td}>{txn.location}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              
          </div>
      );
  };

  export default TransactionHistory;
