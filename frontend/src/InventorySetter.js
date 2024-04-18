import {useContext, useEffect} from 'react'
import EpicMegaContext from './EpicMegaContext'
import {useParams} from 'react-router-dom'

export default function InventorySetter(){
    let {id} = useParams()
    let {user, items, setItems} = useContext(EpicMegaContext)
    useEffect(() => {
        fetch(`http://localhost:8080/items/${id ? id : ''}`)
        .then(response => response.json())
        .then(data => {setItems(data)})
    },[id])
    return (id == user.id && items.length.toString() === '0') ? (<h3 style={{textAlign:'center'}}>nothing here yet</h3>) : undefined
}