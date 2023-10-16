import AllFeatures from "./AllFeatures/AllFeatures"
import MainPage from "./MainPage/MainPage"
import Navbar from "./Navbar/Navbar"
const AdminPage = ({name, closeCheck, setCloseCheck, status, select, setSelect, emptPage, setEmptPage}) => {
    return(
        <div className="AppMainDiv">
            <AllFeatures select={select} closeCheck={closeCheck} setCloseCheck={setCloseCheck} status={status} setSelect={setSelect}/>
            <div className={closeCheck == true ? "AppChildDiv MainPageDiv2" : "AppChildDiv"}>
                <Navbar closeCheck={closeCheck} name={name} setCloseCheck={setCloseCheck}/>
                <MainPage emptPage={emptPage} setEmptPage={setEmptPage} setSelect={setSelect} select={select} closeCheck={closeCheck}/>
            </div>
        </div>
    )
}
export default AdminPage