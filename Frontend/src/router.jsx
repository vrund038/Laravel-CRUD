import {BrowserRouter as Router,Routes,Route} from 'react-react-dom';
import Home from './component/Home';


function RouteComponent(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
            </Routes>
        </Router>
    )
}


export default RouteComponent;