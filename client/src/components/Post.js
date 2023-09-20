import React from 'react';
import {format} from 'date-fns';

export default function Post({title, summary, cover, content,author, createdAt}) {
  return (
    <div className="post">
          <div className="image">
            <img src="https://7dayssuccess.com/wp-content/uploads/2020/05/Computer-Technology.jpeg"/>
          </div>          
          <div className="texts">
          <h2>{title}</h2>
          <p className="info">
            <span className="author">{author.username}</span>
            <time>{format(new Date(createdAt), 'MMM d yyyy H:MM')}</time>
          </p>
          <p className="summary">{summary}</p>
          </div>        
        </div>
  )
}
