import { SignedIn, useUser } from '@clerk/clerk-expo';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SignOutButton } from '../../components/SignOutButton';
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTask';
import { styles } from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useRoutine } from '../../hooks/useRoutine';
import Slider from '@react-native-community/slider';

export default function Page() {
  const { user } = useUser();
  const userId = user?.id;
  const [title, setTitle] = useState('');
  const { tasks, isLoading, createTask, loadData, updateTask, deleteTask } =
    useTasks(userId);
  const {
    energyLevel,
    isLoading: isRoutineLoading,
    fetchRoutine,
    updateEnergyLevel,
  } = useRoutine(userId);
  const [sliderValue, setSliderValue] = useState(3);
  const [selectedQuadrant, setSelectedQuadrant] = useState(1);

  React.useEffect(() => {
    if (userId) loadData();
    if (userId) fetchRoutine();
  }, [userId]);

  const handleCreateTask = () => {
    if (!title.trim()) return;
    createTask({
      title,
      user_id: userId,
      category: 'général',
      priority: selectedQuadrant,
    });
    setTitle('');
    setSelectedQuadrant(1);
  };

  const handleToggleTask = (task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => handleToggleTask(item)}
      >
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={item.completed ? COLORS.primary : COLORS.textLight}
          />
        </View>
        <View style={styles.taskLeft}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && {
                textDecorationLine: 'line-through',
                color: COLORS.textLight,
              },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={16} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );

  const renderQuadrant = (tasks, title, quadrantStyle) => (
    <View style={[styles.quadrant, quadrantStyle]}>
      <Text style={styles.quadrantTitle}>{title}</Text>
      <View style={styles.quadrantContent}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyQuadrantText}>Aucune tâche</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id}>{renderTask({ item: task })}</View>
          ))
        )}
      </View>
    </View>
  );

  return (
    <SignedIn>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Bonjour</Text>
                  <Text style={styles.usernameText}>
                    {user?.emailAddresses[0].emailAddress}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <SignOutButton />
              </View>
            </View>

            {/* Bloc énergie du jour */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceTitle}>Énergie du jour</Text>
              {isRoutineLoading ? (
                <Text style={styles.balanceTitle}>Chargement...</Text>
              ) : energyLevel === null ? (
                <>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor={COLORS.textLight}
                    thumbTintColor={COLORS.primary}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      marginVertical: 8,
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}
                  >
                    {sliderValue} / 5
                  </Text>
                  <TouchableOpacity
                    style={[styles.addButton, { marginTop: 8 }]}
                    onPress={() => updateEnergyLevel(sliderValue)}
                  >
                    <Ionicons name="checkmark" size={20} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Valider</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ alignItems: 'center', marginVertical: 8 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: COLORS.primary,
                    }}
                  >
                    {energyLevel} / 5
                  </Text>
                  <Text style={{ color: COLORS.textLight, marginTop: 4 }}>
                    Énergie renseignée pour aujourd'hui
                  </Text>
                </View>
              )}
            </View>

            {/* Formulaire création tâche */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceTitle}>Nouvelle tâche</Text>
              <TextInput
                style={styles.input}
                placeholder="Titre de la tâche"
                placeholderTextColor={COLORS.textLight}
                value={title}
                onChangeText={setTitle}
              />
              {/* Sélecteur de quadrant */}
              <View style={styles.quadrantSelector}>
                <Text style={styles.balanceTitle}>Priorité :</Text>
                <View style={styles.quadrantButtons}>
                  {[
                    { id: 1, label: 'Urgent + Important', color: '#ef4444' },
                    { id: 2, label: 'Important', color: '#3b82f6' },
                    { id: 3, label: 'Urgent', color: '#f59e0b' },
                    { id: 4, label: 'Non prioritaire', color: '#6b7280' },
                  ].map((quadrant) => (
                    <TouchableOpacity
                      key={quadrant.id}
                      style={[
                        styles.quadrantButton,
                        selectedQuadrant === quadrant.id && {
                          backgroundColor: quadrant.color,
                        },
                      ]}
                      onPress={() => setSelectedQuadrant(quadrant.id)}
                    >
                      <Text
                        style={[
                          styles.quadrantButtonText,
                          selectedQuadrant === quadrant.id && {
                            color: 'white',
                          },
                        ]}
                      >
                        {quadrant.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleCreateTask}
              >
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={styles.addButtonText}>Créer tâche</Text>
              </TouchableOpacity>
            </View>

            {/* Matrice Eisenhower */}
            <View style={styles.balanceCard}>
              <Text style={styles.sectionTitle}>Matrice Eisenhower</Text>

              <View style={styles.matrixGrid}>
                {/* Quadrant 1 - Urgent + Important */}
                <View style={styles.quadrantTopLeft}>
                  <Text style={styles.quadrantLabel}>Urgent + Important</Text>
                  {tasks
                    .filter((t) => t.priority === 1)
                    .map((task) => (
                      <View key={task.id} style={styles.simpleTask}>
                        <TouchableOpacity
                          onPress={() => handleToggleTask(task)}
                        >
                          <Text
                            style={[
                              styles.taskText,
                              task.completed && styles.completedTask,
                            ]}
                          >
                            {task.completed ? '✓ ' : '○ '}
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>

                {/* Quadrant 2 - Important */}
                <View style={styles.quadrantTopRight}>
                  <Text style={styles.quadrantLabel}>Important</Text>
                  {tasks
                    .filter((t) => t.priority === 2)
                    .map((task) => (
                      <View key={task.id} style={styles.simpleTask}>
                        <TouchableOpacity
                          onPress={() => handleToggleTask(task)}
                        >
                          <Text
                            style={[
                              styles.taskText,
                              task.completed && styles.completedTask,
                            ]}
                          >
                            {task.completed ? '✓ ' : '○ '}
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>

                {/* Quadrant 3 - Urgent */}
                <View style={styles.quadrantBottomLeft}>
                  <Text style={styles.quadrantLabel}>Urgent</Text>
                  {tasks
                    .filter((t) => t.priority === 3)
                    .map((task) => (
                      <View key={task.id} style={styles.simpleTask}>
                        <TouchableOpacity
                          onPress={() => handleToggleTask(task)}
                        >
                          <Text
                            style={[
                              styles.taskText,
                              task.completed && styles.completedTask,
                            ]}
                          >
                            {task.completed ? '✓ ' : '○ '}
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>

                {/* Quadrant 4 - Non prioritaire */}
                <View style={styles.quadrantBottomRight}>
                  <Text style={styles.quadrantLabel}>Non prioritaire</Text>
                  {tasks
                    .filter((t) => t.priority === 4)
                    .map((task) => (
                      <View key={task.id} style={styles.simpleTask}>
                        <TouchableOpacity
                          onPress={() => handleToggleTask(task)}
                        >
                          <Text
                            style={[
                              styles.taskText,
                              task.completed && styles.completedTask,
                            ]}
                          >
                            {task.completed ? '✓ ' : '○ '}
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SignedIn>
  );
}
