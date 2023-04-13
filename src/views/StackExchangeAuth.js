import axios from 'axios';
import { useState } from 'react';

const StackExchangeAuth = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [tag, setTag] = useState('');
  const [answers, setAnswers] = useState([]);

  const handleAuthClick = () => {
    setIsAuthOpen(true);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const authData = {
      key: '0aM5FVD78nWuj5aIfNZi1g((',
      access_token: 'pAxk535XGNP5R7cxtE0gJw(('
    };
    try {
      if(!tag){
        alert("Tag is a required field")
        return
      }
      const response = await axios.get(`https://api.stackexchange.com/2.2/search?order=desc&sort=activity&tagged=${tag}&site=stackoverflow&key=${authData.key}&access_token=${authData.access_token}`);
      setAnswers(response.data.items);
      setIsAuthOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleAuthClick}>
        Authenticate
      </button>
      {isAuthOpen && (
        <form onSubmit={handleAuthSubmit}>
          <input type="text" placeholder="Enter tag" value={tag} onChange={e => setTag(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      )}
      {answers.length > 0 && (
        <div>
          <h2>Answers for tag: {tag}</h2>
          <ul>
            {answers.map(answer => (
              <li key={answer.answer_id}>{answer.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default StackExchangeAuth;
