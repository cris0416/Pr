import React, { useState, useEffect }from 'react'
import { Route, useLocation  } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'


const Header = () => {
    const dispatch = useDispatch()
    const location = useLocation()


    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    console.log(user);

    useEffect(() => {
        const token = user?.token

        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
    <header>
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to = '/'>
                    <Navbar.Brand href="/">FoodTeamExpress</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Route render = {({ history }) => <SearchBox history = {history} />}/>
                    <Nav className="ml-auto">
                    <LinkContainer to = '/cart'>
                        <Nav.Link>
                            <i class="fas fa-apple-alt"></i>Products
                        </Nav.Link>
                    </LinkContainer>
                    { userInfo ? ( 
                        <NavDropdown title = {userInfo.name || user.name} id = 'username'>
                            <LinkContainer to = '/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick = {logoutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    )  : <LinkContainer to = '/login'>
                     <Nav.Link>
                         <i class="fas fa-user"></i>Sign In
                         </Nav.Link>
                 </LinkContainer>}
                 {userInfo && userInfo.isAdmin === 'true' && (
                     <NavDropdown title = 'Admin' id = 'adminmenu'>
                     <LinkContainer to = '/admin/userlist'>
                         <NavDropdown.Item>Users</NavDropdown.Item>
                     </LinkContainer>
                     <LinkContainer to = '/admin/productlist'>
                         <NavDropdown.Item>Products</NavDropdown.Item>
                     </LinkContainer>
                     <LinkContainer to = '/admin/orderlist'>
                         <NavDropdown.Item>Sales</NavDropdown.Item>
                     </LinkContainer>
                    </NavDropdown>
                 )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
    )
}

export default Header