export default function BarChartItem({title}) {
    return (
        <li>
            <div className="bar-chart-line">
                <h4>{title}</h4>
                <div className="bar-chart-item">
                    <div className="bar-item"></div>
                </div>
            </div>
        </li>
    );
}