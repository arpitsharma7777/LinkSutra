function ProfileCard({ user }) {
  if (!user) return null;

  function handleCopyLink() {
    const profileLink = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileLink);
    alert("Profile link copied to clipboard!");
  }

  return (
    <div className="profileCard">
      <img
        src={user.avatar || "https://via.placeholder.com/100"}
        alt="profile"
      />

      <h3>{user.display_name || user.username}</h3>

      <p>{user.bio || "LinkSutra User"}</p>

      <button onClick={handleCopyLink}>Copy Link</button>
    </div>
  );
}

export default ProfileCard;