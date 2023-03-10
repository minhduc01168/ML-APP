import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [predict, setPredict] = useState(undefined);
	const [dataInput, setDataInput] = useState({
		age: 20,
		person_income: 4080,
		person_home_ownership: 0,
		person_emp_length: 0,
		loan_intent: 0,
		loan_grade: 0,
		loan_amnt: 0,
		loan_int_rate: 0,
		loan_percent_income: 0,
		cb_person_default_on_file: 0,
		cb_person_cred_hist_length: 0,
	});
	const [errorMessage, setErrorMessage] = useState({
		age: false,
		person_income: false,
		person_emp_length: false,
		loan_amnt: false,
		loan_int_rate: false,
		loan_percent_income: false,
		cb_person_cred_hist_length: false,
	});
	console.log(dataInput);
	console.log(errorMessage);
	useEffect(() => {
		if (dataInput.age !== "") {
			if (dataInput.age < 20 || dataInput.age > 46) {
				setErrorMessage({
					...errorMessage,
					age: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					age: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				age: false,
			});
		}
	}, [dataInput.age]);

	useEffect(() => {
		if (dataInput.person_income !== "") {
			if (
				dataInput.person_income < 4080 ||
				dataInput.person_income > 210000
			) {
				setErrorMessage({
					...errorMessage,
					person_income: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					person_income: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				person_income: false,
			});
		}
	}, [dataInput.person_income]);

	useEffect(() => {
		if (dataInput.person_emp_length !== "") {
			if (
				dataInput.person_emp_length < 0 ||
				dataInput.person_emp_length > 16
			) {
				setErrorMessage({
					...errorMessage,
					person_emp_length: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					person_emp_length: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				person_emp_length: false,
			});
		}
	}, [dataInput.person_emp_length]);

	useEffect(() => {
		if (dataInput.loan_amnt !== "") {
			if (dataInput.loan_amnt < 500 || dataInput.loan_amnt > 27600) {
				setErrorMessage({
					...errorMessage,
					loan_amnt: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					loan_amnt: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				loan_amnt: false,
			});
		}
	}, [dataInput.loan_amnt]);

	useEffect(() => {
		if (dataInput.loan_int_rate !== "") {
			if (
				dataInput.loan_int_rate < 5.42 ||
				dataInput.loan_int_rate > 19.69
			) {
				setErrorMessage({
					...errorMessage,
					loan_int_rate: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					loan_int_rate: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				loan_int_rate: false,
			});
		}
	}, [dataInput.loan_int_rate]);

	useEffect(() => {
		if (dataInput.loan_percent_income !== "") {
			if (
				dataInput.loan_percent_income < 0.01 ||
				dataInput.loan_percent_income > 0.48
			) {
				setErrorMessage({
					...errorMessage,
					loan_percent_income: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					loan_percent_income: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				loan_percent_income: false,
			});
		}
	}, [dataInput.loan_percent_income]);

	useEffect(() => {
		if (dataInput.cb_person_cred_hist_length !== "") {
			if (
				dataInput.cb_person_cred_hist_length < 2 ||
				dataInput.cb_person_cred_hist_length > 16
			) {
				setErrorMessage({
					...errorMessage,
					cb_person_cred_hist_length: true,
				});
			} else {
				setErrorMessage({
					...errorMessage,
					cb_person_cred_hist_length: false,
				});
			}
		} else {
			setErrorMessage({
				...errorMessage,
				cb_person_cred_hist_length: false,
			});
		}
	}, [dataInput.cb_person_cred_hist_length]);

	// t???i xu???ng m?? h??nh TensorFlow.js
	async function runModel() {
		//thay url //can sua bang link mo hinh cua minh,
		//c??ch l???y url:M??? repository GitHub.T??m ?????n file model.json.Nh???p chu???t v??o file model.json ????? m??? n??.Nh???p v??o n??t "Raw".Sao ch??p ?????a ch??? URL t??? tr??nh duy???t c???a b???n.
		//If your model is from Keras, it is likely you need to use tf.loadLayersModel API instead of tf.laodGraphModel API.
		//In the model.json file, there should be a field 'format' that indicates whether it is a graph or layers model.
		const url =
			"https://raw.githubusercontent.com/minhduc01168/ET_Tri_tue_nhan_tao/docsDuc/ann_js/model.json";

		//khoi tao model
		const model = await tf.loadLayersModel(url);
		// console.log(model);
		// x??? l?? data ?????u v??o cho ph?? h???p v???i model

		let inputData = Object.values(dataInput); // M???ng ch???a d??? li???u ?????u v??o
		let minValue = [
			20.0, 4080.0, 0.0, 0.0, 0.0, 0.0, 500.0, 5.42, 0.01, 0.0, 2.0,
		]; // Gi?? tr??? nh??? nh???t c???a d??? li???u ?????u v??o
		let maxValue = [
			46.0, 210000.0, 3.0, 16.0, 5.0, 4.0, 27600.0, 19.69, 0.48, 1.0,
			16.0,
		]; // Gi?? tr??? l???n nh???t c???a d??? li???u ?????u v??o

		// Chu???n h??a d??? li???u ?????u v??o
		for (let i = 0; i < inputData.length; i++) {
			inputData[i] = normalizeData(
				inputData[i],
				minValue[i],
				maxValue[i]
			);
		}
		// console.log(inputData)
		// Convert array --> tensor
		const tftensor = tf.tensor(inputData);
		//chyen ve dung dinh dang dau v??o giong kieu pandas dataframe trong python
		const tensorReshaped = tftensor.reshape([1, 11]);
		// Run image through model
		const pred = model.predict(tensorReshaped);
		// console.log(pred)
		const values = pred.array();
		// console.log(values);
		values
			.then((result) => {
				return result[0];
			})
			.then((result) => setPredict(result));
	}

	//ham chuan hoa du lieu dau vao ve khoang (0,1)
	function normalizeData(data, minValue, maxValue) {
		return (data - minValue) / (maxValue - minValue);
	}
	return (
		<div className="App">
			<header>
				<div className="container">
					<div id="brandname">Machine Learning App</div>
					<h2>Ph??n t??ch r???i ro t??n d???ng qua ph????ng ph??p h???c m??y</h2>
				</div>
			</header>
			<div className="ml-container">
				{/* Main Input For Receiving Query to our ML */}
				{/* <form action="{{ url_for('predict')}}" method="post"> */}
			</div>
			<div>
				<div className="inline">Age:</div>
				<input
					type="number"
					id="age"
					name="age"
					placeholder="Kho???ng gi?? tr??? t??? 20.00 ?????n 46.00"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							age: e.target.value,
						});
					}}
				/>
				{errorMessage.age && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 20.00 ?????n 46.00
					</div>
				)}
			</div>
			<div>
				<div className="inline">Annual Income:</div>
				<input
					type="number"
					id="person_income"
					name="person_income"
					placeholder="Kho???ng gi?? tr??? t??? 4080.00 ?????n 210000.00"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							person_income: e.target.value,
						});
					}}
				/>
				{errorMessage.person_income && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 4080.00 ?????n 210000.00
					</div>
				)}
			</div>
			<div className="object">
				<div className="inline">Home ownership: </div>
				<select
					id="person_home_ownership"
					name="person_home_ownership"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							person_home_ownership: e.target.value,
						});
					}}
				>
					<option value="0">MORTGAGE</option>
					<option value="1">OTHER</option>
					<option value="2">OWN</option>
					<option value="3">RENT</option>
				</select>
			</div>
			<div>
				<div className="inline">Employment length (in years):</div>
				<input
					type="number"
					id="person_emp_length"
					name="person_emp_length"
					placeholder="Kho???ng gi?? tr??? t??? 0 ?????n 16.00"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							person_emp_length: e.target.value,
						});
					}}
				/>
				{errorMessage.person_emp_length && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 0 ?????n 16.00
					</div>
				)}
			</div>
			<div className="object">
				<div className="inline">Loan intent: </div>
				<select
					id="loan_intent"
					name="loan_intent"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_intent: e.target.value,
						});
					}}
				>
					<option value="0">DEPTCONSOLIDATION</option>
					<option value="1">EDUCATION</option>
					<option value="2">HOMEINPROVEMENT</option>
					<option value="3">MEDICAL</option>
					<option value="4">PERSONAL</option>
					<option value="5">VENTURE</option>
				</select>
			</div>
			<div className="object">
				<div className="inline">Loan grade: </div>
				<select
					id="loan_grade"
					name="loan_grade"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_grade: e.target.value,
						});
					}}
				>
					<option value="0">A</option>
					<option value="1">B</option>
					<option value="2">C</option>
					<option value="3">D</option>
					<option value="4">E</option>
					<option value="5">F</option>
					<option value="6">G</option>
				</select>
			</div>
			<div>
				<div className="inline">Loan amount:</div>
				<input
					type="number"
					id="loan_amnt"
					name="loan_amnt"
					placeholder="Kho???ng gi?? tr??? t??? 500.00 ?????n 276000.00"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_amnt: e.target.value,
						});
					}}
				/>
				{errorMessage.loan_amnt && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 500.00 ?????n 276000.00
					</div>
				)}
			</div>
			<div>
				<div className="inline">Interest rate:</div>
				<input
					type="number"
					id="loan_int_rate"
					name="loan_int_rate"
					placeholder="Kho???ng gi?? tr??? t??? 5.42 ?????n 19.69"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_int_rate: e.target.value,
						});
					}}
				/>
				{errorMessage.loan_int_rate && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 5.42 ?????n 19.69
					</div>
				)}
			</div>
			<div>
				<div className="inline">Percent income:</div>
				<input
					type="number"
					id="loan_percent_income"
					name="loan_percent_income"
					placeholder="kho???ng gi?? tr??? t??? 0.01 ?????n 0.48"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_percent_income: e.target.value,
						});
					}}
				/>
				{errorMessage.loan_percent_income && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 0.01 ?????n 0.48
					</div>
				)}
			</div>
			<div className="object">
				<div className="inline">Historical default: </div>
				<select
					id="cb_person_default_on_file"
					name="cb_person_default_on_file"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							cb_person_default_on_file: e.target.value,
						});
					}}
				>
					<option value="0">N</option>
					<option value="1">Y</option>
				</select>
			</div>
			<div>
				<div className="inline">Credit history length:</div>
				<input
					type="number"
					id="cb_person_cred_hist_length"
					name="cb_person_cred_hist_length"
					placeholder="Kho???ng gi?? tr??? t??? 2.00 ?????n 16.00"
					onChange={(e) => {
						setDataInput({
							...dataInput,
							cb_person_cred_hist_length: e.target.value,
						});
					}}
				/>
				{errorMessage.loan_percent_income && (
					<div className="error">
						Nh???p kho???ng gi?? tr??? t??? 2.00 ?????n 16.00
					</div>
				)}
			</div>
			<div>
				{predict !== undefined && predict > 0.5 && (
					<div className="result">
						K???t qu???: C?? th??? tr??? ???????c kho???n vay
					</div>
				)}
				{predict !== undefined && predict <= 0.5 && (
					<div className="result">
						K???t qu???: Kh??ng c?? kh??? n??ng tr??? ???????c kho???n vay
					</div>
				)}
			</div>
			<button
				className="btn btn-primary btn-block btn-large"
				onClick={() => {
					runModel();
				}}
				disabled={
					Object.values(errorMessage).filter((item) => item === true)
						.length > 0
				}
			>
				Predict
			</button>
		</div>
	);
}

export default App;
