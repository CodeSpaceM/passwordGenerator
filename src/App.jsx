import { useState, useCallback, useEffect, useRef} from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numbersAllowed, setNumbersAllowed] = useState(false)
  const [charsAllowed, setCharsAllowed] = useState(false)

  //This default value will not be seen as effect will action after the initial render. 
  const [password, setPassword] = useState("kashishm")
  
  const passwordRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const passwordGenerator = useCallback(
    () => {
      let passwordStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      
      if(numbersAllowed)
        passwordStr += "0123456789"
      if(charsAllowed)
        passwordStr += "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

      let password = ""
      for(let l=0; l<length; l++){
        password += passwordStr[Math.floor(Math.random() * passwordStr.length)]
      }

      return password
      }, [length, numbersAllowed, charsAllowed]
  )

  //for this one we may not use the useCallback as it is an inexpensive function
  const copyPasswordToClipBoard = useCallback(
    () => {
      //window object not available in next.js server side

      // To select highlight the area copied
      // passwordRef.current?.select();
      // passwordRef.current?.setSelectionRange(0, 3);
      // navigator.clipboard.writeText(password)

      //To show copy message for few seconds after the copy
      navigator.clipboard.writeText(passwordRef.current.value).then(() => { //input element does not have innerHTML property
        setCopied(true); // Show the "Copied!" message
  
        // Hide the message after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      });

    }, [password]  
  )

  useEffect(() => {
    setPassword(passwordGenerator())
  }, [passwordGenerator])

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
        <h1 className='text-white text-center my-3'>Password generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0' onClick={copyPasswordToClipBoard}
          >copy</button>
          {copied && <span style={{ color: "green", marginLeft: "10px" }}>Copied!</span>}
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input 
              type="range"
              min={8}
              max={20}
              value={length}
              className='cursor-pointer'
              onChange={(e) => {setLength(e.target.value)}}
            />
            <label>Length: {length}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
                type="checkbox"
                defaultChecked={numbersAllowed}
                id="numberInput"
                onChange={() => {
                    setNumbersAllowed(prev => !prev);
                }}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
              <input
                  type="checkbox"
                  defaultChecked={charsAllowed}
                  id="characterInput"
                  onChange={() => {
                      setCharsAllowed(prev => !prev )
                  }}
              />
              <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
