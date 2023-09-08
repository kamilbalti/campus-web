import AllFeatures from "./AllFeatures/AllFeatures"
import MainPage from "./MainPage/MainPage"
import Navbar from "./Navbar/Navbar"
const AdminPage = ({name, closeCheck, setCloseCheck, status, select, setSelect}) => {
    return(
        <div className="AppMainDiv">
            <Navbar closeCheck={closeCheck} name={name} setCloseCheck={setCloseCheck}/>
            <AllFeatures select={select} closeCheck={closeCheck} setCloseCheck={setCloseCheck} status={status} setSelect={setSelect}/>
            <MainPage setSelect={setSelect} select={select} closeCheck={closeCheck}/>
        </div>
    )
}
export default AdminPage