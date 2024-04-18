import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
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
    padding: 5px;
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
    z-index: 3;
    margin: 5px;
    border-radius: 3px;
    display: block;
    background-color: #08f;
    color: white;
    border: 0px solid;
`

const RedButton = styled(BlueButton)`
    background-color: #b00;
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

export default function ItemView(){
    const [edit, setEdit] = React.useState(false)
    let {id} = useParams()
    const navigate = useNavigate()
    const {items, user} = React.useContext(EpicMegaContext)
    let item = items.find(item => item.id == id)
    const [editItem, setEditItem] = React.useState(Object.assign({}, item))

    React.useEffect(() => {},[editItem])
    return(<>
        <CloseButton onClick={() => {
            navigate('/')
        }}>X</CloseButton>
        {item.userid == user.id && !edit ? (<>
            <BlueButton onClick={() => setEdit(true)} style={{position:'fixed',top:'32vh',right:'30vw'}}>Edit</BlueButton>
            <RedButton onClick={() => {
                fetch(`http://localhost:8080/items/${item.id}`, {
                    method: 'DELETE',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({userid:user.id})
                })
                .then(response => {
                    if(!response.ok){
                        return 0
                    }else{
                        return response
                    }
                })
                .then(data => {
                    if(typeof data === 'number'){
                        alert('something went wrong idk')
                    }else{
                        navigate(`/${user.id}`)
                    }
                })
            }} style={{position:'fixed',top:'32vh',right:'34vw'}}>Delete</RedButton>
        </>) : undefined}
        {edit ? (<>
            <span style={{position:'fixed',zIndex:3,top:'32vh',left:'40vw'}}>click a field to edit it</span>
            <BlueButton onClick={() => {
                fetch(`http://localhost:8080/items/${item.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({userid:user.id,name:editItem.name,desc:editItem.desc,quantity:editItem.quantity})
                })
                .then(response => {
                    if(!response.ok){
                        return 0
                    }else{
                        return response
                    }
                })
                .then(data => {
                    if(typeof data === 'number'){
                        alert('something went wrong idk')
                    }else{
                        navigate(`/${user.id}`)
                        setEdit(false)
                    }
                })
            }} style={{position:'fixed',top:'32vh',right:'30vw'}}>Save</BlueButton>
            <BlueButton onClick={() => setEdit(false)} style={{position:'fixed',top:'32vh',right:'34vw'}}>Cancel</BlueButton>
        </>) : undefined}
        <BlurBackground/>
        <Box>
            <span style={{fontSize:'200%',fontWeight:'bold'}} onClick={() => {
                if(edit){
                    setEditItem({...editItem, name:prompt('Enter new name (empty string to reset)') || item.name})
                }
            }}>{edit ? editItem.name : item.name}</span>
            <span style={{fontSize:'75%',color:'gray'}} onClick={() => {
                if(edit){
                    setEditItem({...editItem, quantity: parseInt(prompt('Enter new quantity (empty string to reset)')) || item.quantity})
                }
            }}>{edit ? `QTY: ${editItem.quantity.toLocaleString()}` : `QTY: ${item.quantity.toLocaleString()}`}</span>
            <div style={{height:'20vh',overflowY:'scroll'}} onClick={() => {
                if(edit){
                    setEditItem({...editItem, desc:prompt('Enter new description (empty string to reset)') || item.desc})
                }
            }}>{edit ? editItem.desc : item.desc}</div>
        </Box>
    </>)
}