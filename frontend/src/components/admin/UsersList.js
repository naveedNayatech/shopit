import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser, clearErrors } from '../../actions/authActions';
import Sidebar from './Sidebar';
import { useHistory } from "react-router-dom";

const UsersList = () => {
    
    let history = useHistory();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(getAllUsers());

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }


    }, [dispatch, alert, error]);

    const deleteUserHandler = async(id) => {
        dispatch(deleteUser(id));
            
        alert.success('User Deleted Successfully');
        history.push('/dashboard');
    }

    const setUsers = () => {
        const data =  { 
            columns: [
                {
                    label: 'Avatar',
                    field: 'avatar',
                    sort: 'asc'
                },
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ], 
            rows: [] 
        }

        users && users.forEach(user => {
            data.rows.push({
                avatar: <Fragment><img src={user.avatar.url} alt="Avatar" className="avatar" /></Fragment>,
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
                actions: <Fragment>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(user?._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                    </Fragment>
            })            
        });
        return data;
    }


    return (
        <Fragment>
            <MetaData title={'All Users | Admin '} />

             <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>    

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5"> All Users </h1>
                        { loading ? <Loader /> : (
                            <MDBDataTable
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                responsive
                            />
                        ) }
                    </Fragment>
                </div>
             </div>   
        </Fragment>
    )
}

export default UsersList
