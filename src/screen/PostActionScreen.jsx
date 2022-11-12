import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SPACING } from "../config/spacing";
import { colors } from "../config/colors";
import * as Yup from "yup";
import { Formik } from "formik"
import FormContainer from "../Form/FormContainer";
import FormInput from "../Form/FormInput";
import * as ImagePicker from "expo-image-picker"
import FormSubmitButton from "../Form/FormSubmitButton";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Titulo invalido")
    .required("Title es requerido!"),

  description: Yup.string()
    .trim()
    .min(3, "description invalido")
    .required("description es requerido!")
})

export default function PostActionScreen({ route }) {
  const post = route.params
  const navigation = useNavigation()
  const [image, setImage] = useState(post?.imgUrl || "")
  const [isloading, setIsLoading] = useState(false)

  const postInfo = {
    title: post?.title || "",
    description: post?.description || ""
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    // console.log(result.uri.split("/")[9]);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const savePost = async (formData) => {
    try {
      setIsLoading(true)
      await axios.post("/post", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("error en savePost", error.message)
    }
  }

  const updatePost = async (formData) => {
    try {
      setIsLoading(true)
      await axios.put(`/post/${post._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("error en updatePost", error.message)
    }
  }

  const actions = async (values, formikActions) => {
    const { title, description } = values
    const formData = new FormData();
    if (post) {
      if (post.imgUrl !== image) {
        formData.append("img", {
          name: image.split("/")[9],
          uri: image,
          type: "image/jpg"
        });
      }
    } else {
      if (image) {
        formData.append("img", {
          name: image.split("/")[9],
          uri: image,
          type: "image/jpg"
        });
      }
    }


    formData.append("title", title);
    formData.append("description", description);
    post
      ? await updatePost(formData)
      : await savePost(formData)


    formikActions.resetForm()
    formikActions.setSubmitting(false)
    navigation.goBack()
  };

  if (isloading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    )
  }
  return (
    <>
      <View style={styles.container}>

        <FormContainer>
          <Formik
            initialValues={postInfo}
            validationSchema={validationSchema}
            onSubmit={actions}
          >
            {
              ({
                values,
                errors,
                touched,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit
              }) => {
                const { title, description } = values
                return (
                  <>
                    <FormInput
                      value={title}
                      error={touched.title && errors.title}
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("titulo")}
                      label="Tiulo"
                      placeholder="Titulo"
                    />

                    <FormInput
                      value={description}
                      error={touched.description && errors.description}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      label="Description"
                      placeholder="Description"
                    />
                    {/*image */}
                    <View>
                      <TouchableOpacity
                        style={styles.uploadBtnContainer}
                        onPress={() => pickImage()}
                      >
                        {image ? (
                          <Image
                            source={{ uri: image }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <Text style={styles.uploadBtn}>Selecionar Imagen</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <FormSubmitButton
                      submitting={isSubmitting}
                      onPress={handleSubmit}
                      title={post ? "Actualizar " : "Guardar"}


                    />

                  </>
                )
              }}





          </Formik>
        </FormContainer>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
  },

  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 60,
    borderColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    // marginLeft: 100,
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
});
