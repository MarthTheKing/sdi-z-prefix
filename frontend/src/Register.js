import React from 'react'
import {useNavigate} from 'react-router-dom'
import EpicMegaContext from './EpicMegaContext'
import styled from 'styled-components'
import Cookies from 'js-cookie'

const BlurBackground = styled.div`
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
`

const LoginBox = styled.div`
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

export default function Login(){
    const navigate = useNavigate()
    const {user, setUser} = React.useContext(EpicMegaContext)
    return(<>
        <CloseButton onClick={() => {
            navigate('/')
        }}>X</CloseButton>
        <BlurBackground/>
        <LoginBox>
            <Input id='firstname' type='text' placeholder='first name' />
            <Input id='lastname' type='text' placeholder='last name' />
            <Input id='username' type='text' placeholder='username' />
            <Input id='password' type='password' placeholder='password' />
            <Input id='passwordagain' type='password' placeholder='confirm password' />
            <BlueButton type='button' onClick={() => {
                let firstname = document.querySelector('#firstname').value
                let lastname = document.querySelector('#lastname').value
                let username = document.querySelector('#username').value
                let password = document.querySelector('#password').value
                let passwordagain = document.querySelector('#passwordagain').value

                let userExp = /^([0-9A-Za-z-_.]){4,12}$/
                let nospaces = / +/
                if(!userExp.exec(username)){
                    return alert('Username must be between 4 and 12 characters and can only contain alphanumeric characters and dot, dash, or underbar')
                }
                if(password.length < 4 || nospaces.exec(password)){
                    return alert('Password must be at least four characters and cannot contain spaces')
                }
                if(password !== passwordagain){
                    return alert('Passwords don\'t match')
                }
                fetch('http://localhost:8080/users', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({firstname, lastname, username, password})
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
                        alert('Username taken')
                    }else{
                        navigate(`/${data.id}`)
                        Cookies.set('login', `${username} ${password}`)
                        setUser(data)
                    }
                })
            }}>Register</BlueButton>
        </LoginBox>
    </>)
}