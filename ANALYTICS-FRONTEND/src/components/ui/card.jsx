export function Card({ children, className }) {
    return <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="border-b pb-2 mb-2 font-semibold text-lg">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="p-2">{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>;
  }
  