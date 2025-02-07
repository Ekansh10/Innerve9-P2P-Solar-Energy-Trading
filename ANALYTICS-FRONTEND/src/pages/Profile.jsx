import React, { useState } from "react";

const Profile = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890",
        contractNo: "9876543210",
        address: "123 Main St, City, Country",

    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (value) => {
        setUserData({ ...userData, rating: value });
    };

    const styles = {
        container: {
            width: "60%",
            margin: "auto",
            padding: "20px",
            background: "linear-gradient(to right, #121212, #1e3c72, #2a5298)",
            color: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "80vh",
            animation: "fadeIn 1s ease-in-out"
        },
        leftSection: {
            flex: 1,
            textAlign: "left",
            padding: "20px"
        },
        rightSection: {
            flex: 1,
            textAlign: "center"
        },
        profilePic: {
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #fff",
            marginBottom: "10px",
            transition: "transform 0.3s ease-in-out"
        },
        uploadLabel: {
            display: "block",
            marginBottom: "10px",
            cursor: "pointer",
            color: "#00bfff"
        },
        input: {
            padding: "10px",
            fontSize: "1rem",
            width: "100%",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            marginBottom: "10px",
            textAlign: "left"
        },
        button: {
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
        star: {
            fontSize: "24px",
            cursor: "pointer",
            transition: "color 0.3s ease-in-out"
        },
        profilePic: {
          width: "150px", // Increased size
          height: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #fff",
          marginBottom: "10px",
          transition: "transform 0.3s ease-in-out",
      },
      profilePicHover: {
          transform: "scale(1.2)", // Enlarges on hover
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)", // Glow effect
      },
      uploadLabel: {
        display: "block",
        marginBottom: "10px",
        cursor: "pointer",
        color: "#00bfff",
        fontSize: "1.5rem", // Increased font size
        fontWeight: "bold",
        transition: "color 0.3s ease-in-out",
    }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftSection}>
                <h2>Profile Page 👤</h2>
                {isEditing ? (
                    <>
                        <input type="text" name="name" value={userData.name} onChange={handleChange} style={styles.input} />
                        <input type="email" name="email" value={userData.email} onChange={handleChange} style={styles.input} />
                        <input type="text" name="phone" value={userData.phone} onChange={handleChange} style={styles.input} />
                        <input type="text" name="contractNo" value={userData.contractNo} onChange={handleChange} style={styles.input} />
                        <input type="text" name="address" value={userData.address} onChange={handleChange} style={styles.input} />
                    
                        <button 
                            onClick={handleSave} 
                            style={styles.button} 
                            onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                        >
                            Save ✅
                        </button>
                    </>
                ) : (
                    <>
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                        <p><strong>Contract No:</strong> {userData.contractNo}</p>
                        <p><strong>Region:</strong> {userData.address}</p>

                        <button 
                            onClick={handleEdit} 
                            style={styles.button} 
                            onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                        >
                            Edit ✏️
                        </button>
                    </>
                )}
            </div>
            <div style={styles.rightSection}>
                <label htmlFor="profilePic" style={styles.uploadLabel}>Change Profile Picture 📷</label>
                <br />
                <input type="file" id="profilePic" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <img 
    src={profilePic || "https://via.placeholder.com/150"} 
    alt="Profile" 
    style={styles.profilePic} 
    onMouseEnter={(e) => e.currentTarget.style.transform = styles.profilePicHover.transform}
    onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
/>

            </div>
        </div>
    );
};

export default Profile;
