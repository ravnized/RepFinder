import React from "react";
import ReportServices from "../services/ReportServices";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../css/reports.css";
class AllReport extends React.Component<
	{ token: string; onStateChange: (error: string, message: string) => void },
	{ message: string; error: string; reports: [] }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
			reports: [],
		};
	}

	async getAllReports() {
		await ReportServices.getAll(this.props.token).then((res) => {
			this.setState({ reports: res.reportList });
		});
	}

    componentDidMount(): void {
        this.getAllReports();
    }

	generateListReport() {
		let listReport: JSX.Element[] = [];

		this.state.reports.map((report: any) => {
			listReport.push(
				<div className="reportList" key={report._id}>
					<p>ItemName:{report.itemName} </p>
					<p>Id: {report.idItem}</p>
					{report.cost !== 0 ? (
						<p className="costToChange">Change the Cost: <br/>{report.cost}</p>
					) : (
						<></>
					)}
					{report.needTodelete !== "false" ? (
						<p className="deleteItem">Need to delete: <br/>{report.needTodelete}</p>
					) : (
						<></>
					)}

					{report.needTodelete !== "false" ? (
						<Button
							onChange={() => {
								console.log("Delete");
								/*
                                ReportServices.delete(report._id, this.props.token).then((res) => {
                                    this.getAllReports();
                                })
                                */
							}}
						>
							Delete
						</Button>
					) : (
						<></>
					)}
					{report.cost !== 0 ? (
						<Button
							onChange={() => {
								console.log("Update");
								/*
                                    ReportServices.update(report._id, this.props.token).then((res) => {
                                        this.getAllReports();
                                    })
                                    */
							}}
						>
							Update
						</Button>
					) : (
						<></>
					)}
				</div>,
			);
		});
		return listReport;
	}

	render(): React.ReactNode {
	
		return <div>{this.generateListReport()}</div>;
	}
}

export { AllReport };
