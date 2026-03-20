function ProfileCard({ user }) {
  if (!user) return <div className="profileCard">Loading profile...</div>;

  return (
    <div className="profileCard">

      <img src={user.avatar_url || "https://i.pravatar.cc/100"} alt="profile" />

      <h3>{user.display_name || user.username}</h3>

      <p>{user.bio || "No bio added"}</p>

      <button>Copy Link</button>

    </div>
  );
}

export default ProfileCard;