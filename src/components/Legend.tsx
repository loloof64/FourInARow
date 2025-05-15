import './Legend.css'

const Legend = () => {
    return (
        <div className="legendRoot">
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Arrow left</td>
                        <td>Move coin left</td>
                    </tr>
                    <tr>
                        <td>Arrow right</td>
                        <td>Move coin right</td>
                    </tr>
                    <tr>
                        <td>Space</td>
                        <td>Drop coin</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}


export default Legend;