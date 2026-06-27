import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.clear(); 
    window.location.href = "/"; 
  };

  
  const linkStyle = (path) => ({
    ...styles.link,
    backgroundColor: location.pathname === path ? "#334155" : "transparent",
    color: location.pathname === path ? "#ffffff" : "#cbd5e1",
    fontWeight: location.pathname === path ? "600" : "400"
  });

  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={{ marginBottom: "30px", fontSize: "1.5rem", fontFamily: '"Cormorant Garamond", serif' }}>
          📚 Admin Panel
        </h2>

        <nav>
          <Link to="/admin/dashboard" style={linkStyle("/admin/dashboard")}>Dashboard</Link>
          <Link to="/admin/books" style={linkStyle("/admin/books")}>Kelola Buku</Link>
          <Link to="/admin/users" style={linkStyle("/admin/users")}>Kelola User</Link>
          <Link to="/admin/loans" style={linkStyle("/admin/loans")}>Peminjaman</Link>
        </nav>
      </div>

      <button onClick={handleSignOut} style={styles.signOutBtn}>
        Sign Out
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px", 
    height: "100vh",
    background: "#1e293b",
    color: "white",
    padding: "24px",
    position: "fixed",
    top: 0,   
    left: 0,  
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    zIndex: 50
  },
  link: {
    display: "block",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    marginTop: "8px",
    fontSize: "0.95rem",
    transition: "all 0.2s ease"
  },
  signOutBtn: {
    background: "transparent",
    color: "#f87171",
    border: "1px solid #7f1d1d",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    width: "full",
    textAlign: "center",
    fontSize: "0.95rem",
    transition: "background 0.2s",
    marginTop: "auto"
  }
};