//React + Pkgs
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  VStack,
  Stack,
  Text,
  Input,
  Select,
  Button,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { dayOfWeek, dateDDMMYYYY, timeHHMM } from "../helpers/constants";

//Constants
import {
  firestore,
  convertRubbishCollectionSnapshotToMap,
} from "../helpers/firebase";

export default function Home() {
  const [status, setStatus] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState(); //init state
  const [subcategoryOptions, setSubCategoryOptions] = useState(null);
  const [brandOptions, setBrandOptions] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }, // catch error messages
  } = useForm({
    defaultValues: {
      longitude: "",
      latitude: "",
    },
  });

  useEffect(() => {
    const rubbishCollectionRef = firestore.collection("rubbish");
    rubbishCollectionRef.onSnapshot(async (snapshot) => {
      const rubbishKeys = convertRubbishCollectionSnapshotToMap(snapshot);
      const rubbishObjToMap = Object.keys(rubbishKeys).map(
        (key) => rubbishKeys[key]
      );
      setCategoryOptions(rubbishObjToMap);
    });
  }, []);

  function submitHandler(data) {
    let day = dayOfWeek;
    let time = timeHHMM();
    let date = dateDDMMYYYY();

    let newData = {
      ...data,
      day,
      date,
      time,
    };

    console.log("data", newData);
    axios({
      method: "post",
      url: "/api/sheet",
      data: newData,
    });
    reset(); // clears the input on submitting
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setValue("longitude", position.coords.longitude);
          setValue("latitude", position.coords.latitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  const handleCategoryOnChange = (e) => {
    const { value } = e.target;
    let subCat,
      brand = [];

    categoryOptions.map((obj) => {
      if (obj.Category === value) {
        subCat = [...obj.Subcategory];
        brand = [...obj.Brand];
      }
    });
    setBrandOptions(brand);
    setSubCategoryOptions(subCat);
  };

  return (
    <div className="container">
      <Head>
        <title>Rubbish Collection App</title>
      </Head>

      <main>
        <VStack spacing="1px" align="center">
          <Text fontSize="1xl" fontWeight="bold">
            Rubbish Collection Form
          </Text>

          <Stack textAlign={"center"} flexDirection={"column"}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Select
                placeholder="Category"
                mt={3}
                {...register("category", { required: "Select Category" })}
                onChange={(e) => handleCategoryOnChange(e)}
              >
                {categoryOptions &&
                  categoryOptions.map((opt, idx) => {
                    return (
                      <option key={idx} value={opt.Category}>
                        {opt.Category}
                      </option>
                    );
                  })}
              </Select>
              <p className="error-text">
                {errors.category && errors.category.message}
              </p>

              <Select
                placeholder="Sub Category"
                variant="filled"
                disabled={!subcategoryOptions ? true : false}
                mt={3}
                {...register("subcategory")}
              >
                {subcategoryOptions !== null &&
                  subcategoryOptions.map((opt, idx) => {
                    return (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
              </Select>
              {/* <p className="error-text">
                {errors.subcategory && errors.subcategory.message}
              </p> */}

              <Select
                placeholder="Brand"
                variant="filled"
                disabled={!brandOptions ? true : false}
                mt={3}
                {...register("brand")}
              >
                {brandOptions !== null &&
                  brandOptions.map((opt, idx) => {
                    return (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
              </Select>
              {/* <p className="error-text">
                {errors.brand && errors.brand.message}
              </p> */}

              <Input
                placeholder="Other Info"
                variant="filled"
                mt={3}
                {...register("other")}
              />

              <Button
                colorScheme="teal"
                bg={"gray.500"}
                mt={3}
                variant="ghost"
                textColor={"white"}
                _hover={{
                  bgColor: "pink.200",
                  textColor: "gray.900",
                }}
                onClick={getLocation}
              >
                Get Location
              </Button>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  placeholder="Latitude"
                  variant="filled"
                  isReadOnly={true}
                  mt={3}
                  mr={2}
                  {...register("latitude")}
                />

                <Input
                  placeholder="Longitude"
                  variant="filled"
                  isReadOnly={true}
                  mt={3}
                  {...register("longitude")}
                />
              </Box>
              <VStack align="center">
                <Button
                  colorScheme="teal"
                  bg={"black"}
                  textColor={"white"}
                  _hover={{
                    bgColor: "pink.200",
                    textColor: "gray.900",
                  }}
                  type="submit"
                  mt={3}
                  variant="ghost"
                >
                  Submit Form
                </Button>
              </VStack>
            </form>
          </Stack>
        </VStack>
      </main>
    </div>
  );
}
