import { useState } from "react";
import { useForm } from "react-hook-form";

const App = () => {
  const [todos, setTodos] = useState([{ id: 12, name: "Hello", age: 12 }]);

  const {
    handleSubmit,
    register,
    reset,
    // showing inp-field's values on every change(be careful it triggers re-render)
    watch,
    // use it for get states like (errors,isLoading)
    // formState: {},
  } = useForm();
  // {
  //it can also handle "async"-func to get fieldValues from server
  // defaultValues: {
  //      name: "HI",
  //      age: 10,
  // },

  // use it for reactive changes when the initial value
  //  values: obj
  // }
  // handleSubmit-> to add submit-func to form
  // register -> to connect(attach) inputs to form

  function submitAdd(e) {
    //work with e.preventDefault()
    console.log(e);

    setTodos((prev) => [...prev, { ...e, id: new Date().getTime() }]);
    reset();
  }

  const [idx, setIdx] = useState(null);

  return (
    <div>
      <form action="" onSubmit={handleSubmit(submitAdd)}>
        <input
          className="border"
          placeholder="Name"
          type="text"
          {...register("name")}
        />
        <input
          className="border"
          placeholder="Age"
          type="number"
          {...register("age")}
        />

        {/* form ui library components  */}
        {/* <Controller
          name="email"
          control={control}
          render={({ field }) => <input {...field} />}
        /> */}

        <button>Submit</button>
      </form>
      <main>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((e) => {
              return (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.age}</td>
                  {/* <td onClick={() => setIdx(e.id)}>Edit</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* {watch("name")} */}
      </main>
    </div>
  );
};

export default App;
