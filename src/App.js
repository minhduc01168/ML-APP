import * as tf from "@tensorflow/tfjs";
import { saveAs } from "file-saver";
import { useState } from "react";
import "./App.css";
import exampleImage from "./image.jpg";

function App() {
	const [predict, setPredict] = useState(undefined);
	const [dataInput, setDataInput] = useState({
		age: 0,
		person_income: 0,
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
	// tải xuống mô hình TensorFlow.js
	async function runModel() {
		//thay url //can sua bang link mo hinh cua minh, 
		//cách lấy url:Mở repository GitHub.Tìm đến file model.json.Nhấp chuột vào file model.json để mở nó.Nhấp vào nút "Raw".Sao chép địa chỉ URL từ trình duyệt của bạn.
		//If your model is from Keras, it is likely you need to use tf.loadLayersModel API instead of tf.laodGraphModel API.
		//In the model.json file, there should be a field 'format' that indicates whether it is a graph or layers model.
		const url = 
			"https://raw.githubusercontent.com/minhduc01168/ET_Tri_tue_nhan_tao/docsDuc/ann_js/model.json";

		//khoi tao model
		const model = await tf.loadLayersModel(url);
		// console.log(model);
		// xử lý data đầu vào cho phù hợp với model 
		
		let inputData = Object.values(dataInput); // Mảng chứa dữ liệu đầu vào
		let minValue = [20.00, 4080.00, 0.00, 0.00, 0.00, 0.00, 500.00, 5.42, 0.01, 0.00, 2.00]; // Giá trị nhỏ nhất của dữ liệu đầu vào
		let maxValue = [46.00, 210000.00, 3.00, 16.00, 5.00, 4.00, 27600.00, 19.69, 0.48, 1.00, 16.00]; // Giá trị lớn nhất của dữ liệu đầu vào

		// Chuẩn hóa dữ liệu đầu vào
		for (let i = 0; i < inputData.length; i++) {
  			inputData[i] = normalizeData(inputData[i], minValue[i], maxValue[i]);
		}
		// console.log(inputData)
		// Convert array --> tensor
		const tftensor = tf.tensor(inputData);
		//chyen ve dung dinh dang dau vào giong kieu pandas dataframe trong python
		const tensorReshaped = tftensor.reshape([1, 11]);
		// Run image through model
		const pred = model.predict(tensorReshaped)
		// console.log(pred)
		const values = pred.array();
        // console.log(values);
		values.then(result => {
			return result[0]
		  }).then((result) => setPredict(result))
		  
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
					<h2>Phân tích rủi ro tín dụng qua phương pháp học máy</h2>
				</div>
			</header>
			<div className="ml-container">
				{/* Main Input For Receiving Query to our ML */}
				{/* <form action="{{ url_for('predict')}}" method="post"> */}
			</div>
			<div>
				<div className="inline">person_age:</div>
				<input
					type="number"
					id="age"
					name="age"
					min={18}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							age: e.target.value,
						});
					}}
				/>
			</div>
			<div>
				<div className="inline">person_income:</div>
				<input
					type="number"
					id="person_income"
					name="person_income"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							person_income: e.target.value,
						});
					}}
				/>
			</div>
			<div className="object">
				<div className="inline">person_home_ownership: </div>
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
				<div className="inline">person_emp_length:</div>
				<input
					type="number"
					id="person_emp_length"
					name="person_emp_length"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							person_emp_length: e.target.value,
						});
					}}
				/>
			</div>
			<div className="object">
				<div className="inline">loan_intent: </div>
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
				<div className="inline">loan_grade: </div>
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
				<div className="inline">loan_amnt:</div>
				<input
					type="number"
					id="loan_amnt"
					name="loan_amnt"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_amnt: e.target.value,
						});
					}}
				/>
			</div>
			<div>
				<div className="inline">loan_int_rate:</div>
				<input
					type="number"
					id="loan_int_rate"
					name="loan_int_rate"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_int_rate: e.target.value,
						});
					}}
				/>
			</div>
			<div>
				<div className="inline">loan_percent_income:</div>
				<input
					type="number"
					id="loan_percent_income"
					name="loan_percent_income"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							loan_percent_income: e.target.value,
						});
					}}
				/>
			</div>
			<div className="object">
				<div className="inline">cb_person_default_on_file: </div>
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
				<div className="inline">cb_person_cred_hist_length:</div>
				<input
					type="number"
					id="cb_person_cred_hist_length"
					name="cb_person_cred_hist_length"
					min={0}
					max={9000000000000000}
					onChange={(e) => {
						setDataInput({
							...dataInput,
							cb_person_cred_hist_length: e.target.value,
						});
					}}
				/>
			</div>
			<div>				
				{
					predict !== undefined && predict > 0.5 && <div className="result">Kết quả: Có thể trả được khoản vay</div>
				}
				{
					predict !== undefined && predict <= 0.5 && <div className="result">Kết quả: Không có khả năng trả được khoản vay</div>
				}
			</div>
			<button
				className="btn btn-primary btn-block btn-large"
				onClick={() => {
					runModel();
				}}
			>
				Predict
			</button>
		</div>
	);
}

export default App;
