"use client"; 

import { useState, useEffect } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Grid,
  Avatar,
  Input,
} from "@mui/material";
import moment from "moment";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    date: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Set up real-time listener for Firestore changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "projects"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedData = data.map((project) => ({
          ...project,
          formattedDate: moment(project.date).format("LL"),
        }));

        setProjects(formattedData);
      },
      (error) => {
        console.error("Error fetching real-time updates:", error);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Add a new project to Firestore with an image
  const addProject = async () => {
    if (!newProject.title || !newProject.image) {
      alert("Please add both a title and an image!");
      return;
    }

    setLoading(true);

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `projects/${newProject.image.name}`);
      await uploadBytes(imageRef, newProject.image);
      const imageUrl = await getDownloadURL(imageRef);

      // Save project data to Firestore, including the image URL
      await addDoc(collection(db, "projects"), {
        title: newProject.title,
        date: new Date().toISOString(),
        imageUrl: imageUrl,
      });

      // Reset the form and close the modal after the upload is complete
      setNewProject({ title: "", date: "", image: null });
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
      setOpenModal(false)
    }
  };

  const handleImageChange = (e) => {
    setNewProject({ ...newProject, image: e.target.files[0] });
  };

  const openProjectModal = () => {
    setNewProject({ title: "", date: "", image: null });
    setOpenModal(true);
  };

  return (
    <>
      <Container>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Add Check In
        </Typography>

        <Button
          variant="contained"
          onClick={openProjectModal}
          sx={{ marginBottom: 2 }}
        >
          Add Checkin
        </Button>

        
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  boxShadow: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                {project.imageUrl && (
                  <Box
                    sx={{
                      height: 160,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                      marginBottom: 2,
                      backgroundImage: `url(${project.imageUrl})`,
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  {project.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  {project.formattedDate}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar sx={{ width: 30, height: 30 }}>ZN</Avatar>
                  <Typography variant="body2">Checkin Name</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Add check in</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ marginBottom: 2 }}
            />
            {newProject.image && (
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Selected Image: {newProject.image.name}
              </Typography>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="contained" onClick={addProject}>
                Add
                
              </Button>

              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)} 
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
}
