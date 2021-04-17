
import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import waitImg from './wait.gif';

//var userId;
var email;
//var userIdTop;
//var userImage;

var admin="false";
var selectedUser;


function wait(onOff){
	       //alert(onOff);
		   if (onOff === 'on') { 
		     document.getElementById('waitDiv2').style.display = "block";
		     document.body.style.cursor='default';
		   } else  if (onOff === 'off') { 
		     document.getElementById('waitDiv2').style.display = "none";
		     document.body.style.cursor='default';
		   } 
       }


class Container extends React.Component {
  constructor(props) {
    super(props);

	//document.getElementById('StockListAdmin').src=
	//"https://www.stocklistsite.com?userid=" + userId + "&color="+color;
	//?userid=thambrick&color=red		  	  
	//let params = window.location.search;
	//alert(params);

	this.state = {values: []};
	    //window.location="https://www.stocklistnow.com/";
    }
  
    componentDidMount() {
		
	    //let userId = window.location.search;
	    //userId = userId.replace("?userid=", "");
	    ///alert(userId);
		this.UserList("");
    }

		
    callUpdateUserAPI = (userId, email, displayName, city, admin, userImage, screen, deleteUser)=>{
		if (!admin)admin="false";
		let userIdv = window.location.search;
		userIdv = userIdv.replace("?userid=", "");
		if (userIdv===userId) {
			  alert("You cant delete yourself")
			  wait('off');
		} else {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin,"userImage":userImage,"screen":screen,"deleteUser":deleteUser });
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};
			//alert("NEW callUpdateUserAPI......");alert(raw);
			fetch("https://61r499x9jc.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
			.then(response => response.text())
			 //.then(result => document.getElementById('getDataInputLabel').innerHTML=JSON.parse(result).body)
			//.then(result => setUpdateUserData(JSON.parse(result).body,raw))
			.then(result => this.setDelUserData(JSON.parse(result).body))
			//.then(result => alert(JSON.parse(result).body))
			.catch(error => alert(JSON.parse(error).body));
		}	
	}
	
    setDelUserData(oneUserData){
        //alert(oneUserData);
	    //let userId = window.location.search;
	    //userId = userId.replace("?userid=", "");
		//alert(userId);
		this.UserList("");
    }	   
  
    CallGetUserAPI = (userId)=>{
		var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({"userId":userId});  //get one user, again
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
			//alert(raw)
            fetch("https://2oyvb32mlh.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
			 .then(result => this.setGetUserData(result))
            .catch(error => alert(error));
        }
		

    setGetUserData(oneUserData){
			//alert("setGetUserData===");
			//alert(oneUserData);
			oneUserData = "{\"values\":" + oneUserData + "}"
			oneUserData = JSON.parse(oneUserData);
			selectedUser=oneUserData.values[0].userId;
			admin=oneUserData.values[0].administrator;
			//alert(admin);
			if (!admin) admin="false"
			
		    if (admin==="true"){
			   admin="true";
			   this.setState({ checked: true })
			} else {
			   admin="false";
			   this.setState({ checked: false })
			}  
			   
			document.getElementById("email").value=oneUserData.values[0].email;
			document.getElementById("displayName").value=oneUserData.values[0].displayName;
			document.getElementById("city").value=oneUserData.values[0].city;
			document.getElementById("userId").innerHTML=oneUserData.values[0].userId;
			document.getElementById("userImage").value=oneUserData.values[0].userImage;
			document.getElementById("screen").value=oneUserData.values[0].screen;

			wait('off');
		}


	
	UserList(userId) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({"userId":userId});
		//var raw2 = JSON.parse(raw)  {"userId":"thambrick4"}  this needs to change to bring back all users
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
			//alert(raw)    ///new
            fetch("https://hpugfe4kld.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
             .then(result => this.setStateNow(result))
			 .catch(error => alert(error));
        }
		

    setStateNow(userData){
        //userData = userData.replace("Items", "values",1);
		userData = "{\"values\":" + userData + "}"
		//alert(userData)
		let userId = window.location.search;
	    userId = userId.replace("?userid=", "");
		//alert(userId);
		//alert(userData);
		//alert(userData.search("\""+userId+"\""))
		if (userData.search("\""+userId+"\"")===-1) {	
        //if (userData.length<5) {	
            alert("You must login first")		
		    wait('off');
		} else {		
		   userData = JSON.parse(userData);
		   ///alert(userData.values[0].userId)
		   this.CallGetUserAPI(userData.values[0].userId);

    	   this.setState(userData);
		} 
    }

	deleteProfile = () => {
		if (window.confirm('Comfirm delete user?')) {
			wait('on');
			//this.CallDeleteUserAPI(selectedUser); 
			this.callUpdateUserAPI(selectedUser,"","","","","","","delete"); 
		}
	}

    updateProfile = () => {

		wait('on');
		try {
			//let userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
			let userId = document.getElementById("userId").innerHTML;
			//alert(userId);
			let email = document.getElementById("email").value;
			let city = document.getElementById("city").value;
			let displayName = document.getElementById("displayName").value;
			
			let userImage = document.getElementById("userImage").value;
			let screen = document.getElementById("screen").value;
			
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            //var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin});
			//var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin,"userImage":userImage,"color":color });
            var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin,"userImage":userImage,"screen":screen ,"deleteUser":"" });
           
		    //alert("444");alert(raw);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
			fetch("https://61r499x9jc.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
			//fetch("https://u3yyrwv2r5.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
            .then(response => response.text())
             //.then(result => document.getElementById('getDataInputLabel').innerHTML=JSON.parse(result).body)
            .then(result => {alert(JSON.parse(result).body);wait('off')})
			//.then(result => alert(JSON.parse(result).body))
            .catch(error => alert(JSON.parse(error).body));
		} catch (error) {
			//console.error(error);
			alert(error);
		}
	  }


	handleCheckboxChange = event => {
		if (event.target.checked)
			admin="true";
		else 
			admin="false";  
		  
		this.setState({ checked: event.target.checked })
	  }
	  
	handleChange = (e) => {
		//alert(e.target.value)
		selectedUser=e.target.value;
		this.setState({selectedValue: e.target.value})
		this.CallGetUserAPI(e.target.value); 
		//class="wrapper style2 spotlights"
		//    <section id="yourProfile" style={{backgroundColor:'black'}} class="wrapper style2 spotlights">
	  }
	 
	render() {
		let optionTemplate = this.state.values.map(v => (
		   <option value={v.userId}>{v.displayName}</option>   
		)); 
	
	const Checkbox = props => (
		<input type="checkbox" {...props} />
	)
			
    return (    
	            <section id="yourAdmin" style={{backgroundColor:'black'}} class="wrapper style2 spotlights">
                <div class="inner">    
				<div id="waitDiv2" align="center" style={{zIndex:10000}}>
					<img id='waitImg2' alt="Wait" src={waitImg} class='ajax-loader'  style={{zIndex:10000,position: 'absolute',left: 0,top: 0,right: 0,bottom: 0,margin: 'auto'}}/>
				</div>
				<center><h2><label id='profileTitle'>Administration</label></h2>
				<form id='profileForm' method='post' >					
				<table> 
				<tr>
				<td align='right' style={{width:'33%'}}><label>Name</label></td>
				<td align='left' colspan='2' >
				<select style={{dropdownIndicator:'black',width:'215px',background:'white',color:'rgba(25, 25, 25, 5)'}} value={this.state.value} onChange={this.handleChange}>
					{optionTemplate}
				</select>
                </td>
                </tr>
				<tr><td align='right' style={{width:'33%'}}><label>City</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='city' onchange={this.handleChange}/></td></tr>
                
				<tr><td align='right' style={{width:'33%'}}><label>Screen</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='screen' onchange={this.handleChange}/></td></tr>
				<tr><td align='right' style={{width:'33%'}}><label>Image</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='userImage' onchange={this.handleChange}/></td></tr>
				<tr><td align='right' style={{width:'33%'}}><label>Email</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} defaultValue={email} id='email' onchange={this.handleChange}/></td></tr>
			    <tr><td align='right' style={{width:'33%',}}><label>ID</label></td><td><label id='userId'></label></td></tr>
			    
				<tr><td align='right'style={{width:'33%',textAlignVertical:'top',color:'rgba(25, 25, 25, 5)'}}><label>Admin</label></td><td>		
				<input type="checkbox" style={{textAlignVertical:'bottom'}}onChange={this.handleCheck} defaultChecked={this.state.checked}/>
				<label>
				<Checkbox id='admin'
					checked={this.state.checked}
					onChange={this.handleCheckboxChange}
				/>
				</label>
			    <input type='hidden' id='displayName' />

				</td></tr>
				<tr><td colspan='2' align='center'>
				<input type='button' value="Update" id='updateProfile' onClick={this.updateProfile}/> 
			    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<input type='button' value="Delete User" id='updateProfile' onClick={this.deleteProfile}/>


				</td></tr>
				</table>
				
                </form>
				</center>
                </div>				
				</section> 
        );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));
