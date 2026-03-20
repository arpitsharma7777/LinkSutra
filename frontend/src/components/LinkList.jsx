import LinkCard from "./LinkCard";

function LinkList() {

  const links = [
    {name:"YouTube", url:"youtube.com"},
    {name:"Instagram", url:"instagram.com"},
    {name:"Portfolio", url:"alexmorgan.com"}
  ];

  return (
    <div>
      {links.map((link,index) => (
        <LinkCard key={index} link={link}/>
      ))}
    </div>
  );
}

export default LinkList;