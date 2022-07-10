import React, {useState} from 'react'
import BlogContext from './BlogContext';

const BlogState = (props) => {
  const [userData,setUserData] = useState(null);
  const [file,setFile] = useState(null);
  const [blogFile,setBlogFile] = useState(null);
  const [_file_, set_File_] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherBlogURL,setOtherBlogURL] = useState("fashion");
  const categoryOption = [
    "Fashion", "Technology", "Food", "Politics", "Sports", "Business"
  ]

  const changeOtherBlogUrl = (url)=>
  {
    setOtherBlogURL(url)
  }

  const isStartsWithWhiteSpace = (string) => {
    //this is a regular expression for checking that string is starts with whitespace
    let regex = /^\s/g
    return (regex.test(string))
  }


  function FormatedDate(dateString)
  {
    const date = new Date(dateString)
    let localDate = date.toDateString();
    let localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let formatedDate = `${localDate} ${localTime}`
    return formatedDate
  }

 const excerpt = (str,count)=>
 {
  if(str.length>count)
  {
    str=str.substring(0,count) + ".....";
  }
  return str;
 }

 //this function is used to create unique string value based on length parameter
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }


  return (
    <BlogContext.Provider value={{ userData, setUserData, file, setFile, blogFile, setBlogFile, _file_, set_File_, loading, setLoading, isStartsWithWhiteSpace, FormatedDate, excerpt, otherBlogURL, setOtherBlogURL, changeOtherBlogUrl, categoryOption, makeid }}>
      {props.children}
      </BlogContext.Provider>
  )
}

export default BlogState