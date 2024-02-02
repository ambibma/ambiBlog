

function Title({title, link, date}) {
  
  return (
    <div>
      <a href={link} >{title}</a>
      <h3>{date}</h3>
    </div>
  );
}

export default Title;     