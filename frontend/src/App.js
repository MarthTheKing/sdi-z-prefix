import {Routes, Route, useNavigate} from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import EpicMegaContext from './EpicMegaContext'
import Navbar from './Navbar'
import Login from './Login'
import Register from './Register'
import InventorySetter from './InventorySetter'
import Create from './Create'
import ItemView from './ItemView'

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

const Item = styled.div`
    border-radius: 5px;
    padding: 5px;
    border: 5px solid black;
    width: 250px;
    height: 150px;
`

export default function App(){
    const navigate = useNavigate()
    const [itemSwitch, setItemSwitch] = React.useState(false)
    const [items, setItems] = React.useState([])
    const [user, setUser] = React.useState({})
    React.useEffect(() => {
        if(Cookies.get('login')){
            let login = Cookies.get('login').split(' ')
            fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({username:login[0],password:login[1]})
            })
            .then(response => {
                if(!response.ok){
                    return 'no es bueno'
                }else{
                    return response.json()
                }
            })
            .then(prev => {
                if(typeof prev === 'string'){
                    Cookies.remove('login')
                }else{
                    setUser(prev)
                }
            })
        }
    },[])
    return(
        <EpicMegaContext.Provider value={{itemSwitch, setItemSwitch, items, setItems, user, setUser}}>
            <Navbar />
            <h1 style={{textAlign:'center'}}>epic inventory app</h1>
            <Container>
                {items.map(item => (<Item onClick={() => navigate(`/items/${item.id}`)} key={item.id}><span style={{fontSize:'200%',fontWeight:'bold'}}>{item.name}</span><br/><span style={{fontSize:'75%',color:'gray'}}>(QTY: {item.quantity.toLocaleString()})</span><br/>{item.desc.length > 100 ? item.desc.substring(0,100) + '...' : item.desc}</Item>))}
            </Container>
            <Routes>
                <Route path='/' element={(<InventorySetter />)} />
                <Route path='/:id' element={<InventorySetter />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/create' element={<Create />} />
                <Route path='/items/:id' element={<ItemView />} />
            </Routes>
        </EpicMegaContext.Provider>
    )
}