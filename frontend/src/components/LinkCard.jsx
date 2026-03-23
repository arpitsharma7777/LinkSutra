function LinkCard({link}) {
  return (

    <div className="linkCard">

      <div>
        <h4>{link.name}</h4>
        <p>{link.url}</p>
      </div>

      <div>
        <button>Edit</button>
        <button>Copy</button>
        <button>Delete</button>
      </div>

    </div>
  );
}

export default LinkCard;