import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex justify-center mb-4">
      <img
        src="/assets/logo.png" // يجب أن تكون صورة الشعار في مجلد 'assets' في الدليل الجذر.
        alt="شعار وزارة الداخلية"
        className="w-32 h-auto sm:w-40"
      />
    </div>
  );
};

export default Logo;
