import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL_V1 = process.env.REACT_APP_BASE_URL_V1;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        await axios.post(`${BASE_URL_V1}add-income`, income, getAuthHeader())
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL_V1}get-incomes`, getAuthHeader())
        setIncomes(response.data)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL_V1}delete-income/${id}`, getAuthHeader())
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate expenses
    const addExpense = async (income) => {
        await axios.post(`${BASE_URL_V1}add-expense`, income, getAuthHeader())
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL_V1}get-expenses`, getAuthHeader())
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL_V1}delete-expense/${id}`, getAuthHeader())
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axios.get(`${BASE_URL}users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            setError(error.response?.data?.message || "Error fetching user");
        }
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            user,
            getUser
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}