import Marquee from './Marquee';
import ServiceTiles from './ServiceTiles';
import './Dashboard.css';

export default function Dashboard() {

  return (
    <div className="dashboard">
      <Marquee />
      
      <div className="dashboard-content">
        <ServiceTiles />
      </div>
    </div>
  );
}
