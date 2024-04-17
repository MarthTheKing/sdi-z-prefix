import React from 'react'
import {useNavigate} from 'react-router-dom'
import EpicMegaContext from './EpicMegaContext'
import styled from 'styled-components'

const ExpandButton = styled.button`
    border-radius: 3px;
    background-color: white;
    border: 3px solid black;
    position: fixed;
    top: 1vh;
    left: 1vw;
    width: 25px;
    height: 25px;
`

const Spacer = styled.div`
    margin: 3px;
`

const CollapseButton = styled.button`
    border-radius: 3px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border: 3px solid black;
    width: 25px;
    height: 25px;
`

const ExpandedBar = styled.div`
    border-radius: 3px;
    text-align: center;
    padding: 3px;
    border: 3px solid black;
    position: fixed;
    top: 1vh;
    left: 1vw;
`

const AccountButton = styled.button`
    border-radius: 3px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: #08f;
    color: white;
    border: 0px solid #00f;
`

export default function Navbar(){
    const navigate = useNavigate()
    const {user, setUser} = React.useContext(EpicMegaContext)
    const [expanded, setExpanded] = React.useState(false)
    return expanded ? (
        <ExpandedBar>
            <CollapseButton onClick={() => {
            setExpanded(false)
        }}>∧</CollapseButton>
            <Spacer/>
            <AccountButton onClick={() => {
                if(user.username){
                    setUser({})
                }else{
                    navigate('/login')
                }
            }}>{user.username ? 'Logout' : 'Login'}</AccountButton>
        </ExpandedBar>
    ) : (
        <ExpandButton onClick={() => {
            setExpanded(true)
        }}>∨</ExpandButton>
    )
}