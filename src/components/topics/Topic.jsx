import React from 'react';

const Topic = () => {

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Info</h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Investigators</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Prof. Mooi Choo Chuah <p className="text-blue-600">mcc7@lehigh.edu</p></li>
            <li>Aidan 'James' Hoffmeister <p className="text-blue-600">jah823@lehigh.edu</p></li>
          </ul>
          
        </div>

        
      </div>
    </div>
  );
};

export default Topic;