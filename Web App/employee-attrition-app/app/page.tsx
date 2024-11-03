'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const PredictionPage = () => {
  const [age, setAge] = useState<number | ''>('');
  const [businessTravel, setBusinessTravel] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('');
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [salary, setSalary] = useState<number | ''>('');
  const [overTime, setOverTime] = useState<string>('');
  const [yearsAtCompany, setYearsAtCompany] = useState<number | ''>('');
  const [yearsInMostRecentRole, setYearsInMostRecentRole] = useState<number | ''>('');
  const [yearsSinceLastPromotion, setYearsSinceLastPromotion] = useState<number | ''>('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [status, setStatus] = useState<'happy' | 'sad' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: Check if required fields are filled
    if (!age || !businessTravel || !department || !jobRole || !maritalStatus || !salary || !overTime || !yearsAtCompany || !yearsInMostRecentRole || !yearsSinceLastPromotion) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setErrorMessage(null); // Reset error message

    const formData = {
      Age: age,
      BusinessTravel: businessTravel,
      Department: department,
      JobRole: jobRole,
      MaritalStatus: maritalStatus,
      Salary: salary,
      OverTime: overTime,
      YearsAtCompany: yearsAtCompany,
      YearsInMostRecentRole: yearsInMostRecentRole,
      YearsSinceLastPromotion: yearsSinceLastPromotion,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      setPrediction(result.prediction);

      // Set status based on prediction
      if (result.prediction === 'likely to stay with the company') {
        setStatus('happy');
      } else {
        setStatus('sad');
      }
    } catch (error) {
      console.error('Error:', error);
      setPrediction(null);
      setStatus(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Employee Attrition Prediction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(Number(e.target.value))} 
              placeholder="Age" 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700 placeholder-gray-400" 
              required 
            />
            <input 
              type="number" 
              value={salary} 
              onChange={(e) => setSalary(Number(e.target.value))} 
              placeholder="Salary" 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700 placeholder-gray-400" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select 
              value={businessTravel} 
              onChange={(e) => setBusinessTravel(e.target.value)} 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700"
              required
            >
              <option value="" disabled>Business Travel</option>
              <option value="Some Travel">Some Travel</option>
              <option value="No Travel">No Travel</option>
              <option value="Frequent Traveller">Frequent Traveller</option>
            </select>
            <select 
              value={department} 
              onChange={(e) => {
                const newDepartment = e.target.value;
                setDepartment(newDepartment);
                // Reset job role if department changes
                if (newDepartment !== 'Sales') setJobRole('');
              }} 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700"
              required
            >
              <option value="" disabled>Department</option>
              <option value="Sales">Sales</option>
              <option value="Technology">Technology</option>
              <option value="Human Resource">Human Resource</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select 
              value={jobRole} 
              onChange={(e) => setJobRole(e.target.value)} 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700"
              required
            >
              <option value="" disabled>Job Role</option>
              {department === 'Sales' && (
                <>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="Analytics Manager">Analytics Manager</option>
                </>
              )}
              {department === 'Technology' && (
                <>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Software Engineer">Software Engineer</option>
                </>
              )}
              {department === 'Human Resource' && (
                <>
                  <option value="HR Business Partner">HR Business Partner</option>
                  <option value="Recruiter">Recruiter</option>
                </>
              )}
            </select>
            <select 
              value={maritalStatus} 
              onChange={(e) => setMaritalStatus(e.target.value)} 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700"
              required
            >
              <option value="" disabled>Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select 
              value={overTime} 
              onChange={(e) => setOverTime(e.target.value)} 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700"
              required
            >
              <option value="" disabled>Over Time</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <input 
              type="number" 
              value={yearsAtCompany} 
              onChange={(e) => setYearsAtCompany(Number(e.target.value))} 
              placeholder="Years at Company" 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700 placeholder-gray-400" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={yearsInMostRecentRole} 
              onChange={(e) => setYearsInMostRecentRole(Number(e.target.value))} 
              placeholder="Years in Most Recent Role" 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700 placeholder-gray-400" 
              required 
            />
            <input 
              type="number" 
              value={yearsSinceLastPromotion} 
              onChange={(e) => setYearsSinceLastPromotion(Number(e.target.value))} 
              placeholder="Years Since Last Promotion" 
              className="border border-gray-600 rounded p-2 w-full text-white bg-gray-700 placeholder-gray-400" 
              required 
            />
          </div>

          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded p-3 w-full hover:scale-105 transition-transform duration-300">
          Predict
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>

        {prediction && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl text-white">Prediction Result</h2>
            <p className="text-white">{prediction}</p>
            <div className="flex justify-center mt-4">
              {status === 'happy' ? (
                <motion.span 
                  role="img" 
                  aria-label="happy face" 
                  className="text-6xl" 
                  initial={{ scale: 1 }} 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 0.5 }}
                >
                  😃
                </motion.span>
              ) : (
                <motion.span 
                  role="img" 
                  aria-label="sad face" 
                  className="text-6xl" 
                  initial={{ scale: 1 }} 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 0.5}}
                >
                  😢
                </motion.span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
