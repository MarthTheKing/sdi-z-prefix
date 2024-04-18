import React from 'react'
import {useNavigate} from 'react-router-dom'
import EpicMegaContext from './EpicMegaContext'
import styled from 'styled-components'

const BlurBackground = styled.div`
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
`

const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: 5px solid black;
    background-color: white;
    z-index: 2;
    position: fixed;
    top: 30vh;
    left: 30vw;
    height: 40vh;
    width: 40vw;
`

const Input = styled.input`
    margin: auto;
    display: block;
    height: fit-content;
    background-color: white;
    border: 3px solid black;
    border-radius: 3px;
    font-size: 150%;
`

const BlueButton = styled.button`
    margin: 5px;
    border-radius: 3px;
    display: block;
    background-color: #08f;
    color: white;
    border: 0px solid #00f;
    font-size: 150%;
`

const CloseButton = styled.button`
    z-index: 3;
    border-radius: 3px;
    background-color: white;
    border: 3px solid black;
    position: fixed;
    top: 32vh;
    left: 32vw;
    width: 25px;
    height: 25px;
`

export default function Create(){
    const navigate = useNavigate()
    const {user, setUser} = React.useContext(EpicMegaContext)
    return(<>
        <CloseButton onClick={() => {
            navigate('/')
        }}>X</CloseButton>
        <BlurBackground/>
        <Box>
            <Input id='name' type='text' placeholder='name' />
            <Input id='desc' type='text' placeholder='description' />
            <Input id='quantity' type='number' placeholder='quantity' />
            <BlueButton type='button' onClick={() => {
                let name = document.querySelector('#name').value
                let desc = document.querySelector('#desc').value
                let quantity = document.querySelector('#quantity').value

                fetch('http://localhost:8080/items', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({id:user.id, name, desc, quantity})
                })
                .then(response => {
                    if(!response.ok){
                        return 'nuh uh'
                    }else{
                        return response.json()
                    }
                })
                .then(data => {
                    if(typeof data === 'string'){
                        alert('somehow it didn\'t work just try again tbh')
                    }else{
                        navigate(`/${user.id}`)
                    }
                })
            }}>Create</BlueButton>
        </Box>
    </>)
}