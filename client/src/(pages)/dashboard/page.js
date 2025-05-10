import React from 'react';
import Header from '../../components/Dashboard/Header';
import Sidebar from '../../components/Dashboard/Sidebar';
import MainContent from '../../components/Dashboard/MainContent';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <Header 
                userName={user?.fullName || 'User'} 
                userProfileImage={user?.profileImageUrl}
            />
            <div className="dashboard-content">
                <Sidebar />
                <MainContent />
            </div>
        </div>
    );
};

export default Dashboard;