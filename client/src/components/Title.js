import {format} from 'date-fns';

function Title({title, tech, link, description, date}) {


  
  return (
    <>
    <div className="titleClass">
      <>
        {tech ? (
          <>
            <a className='titleLink' href={link}>{title} - <span className="titleTech">{tech}</span></a>
          </>


        ) : (
          <>
          <a className='titleLink' href={link}>{title}</a>
          </>

        )} 
        <p className="titleDescription">{description}</p>
        {date ? (
          <>
             <p><time>{format(new Date(date), 'MMM d yyyy H:MM')}</time></p>
          </>


        ) : (
          <>
         
          </>

        )} 
        
       </>
    </div>
    </>
  );
}

export default Title;     

